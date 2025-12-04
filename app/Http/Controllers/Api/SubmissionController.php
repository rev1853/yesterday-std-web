<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use App\Models\Submission;
use App\Models\SubmissionPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use ZipArchive;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Submission::with(['album', 'photos', 'client']);

        if ($user->role === 'creator') {
            $query->whereHas('album', fn ($q) => $q->where('creator_id', $user->id));
        } elseif ($user->role === 'client') {
            $query->where('client_id', $user->id);
        }

        return response()->json($query->orderByDesc('submitted_at')->get());
    }

    public function show(Request $request, Submission $submission)
    {
        $this->authorizeSubmissionAccess($request, $submission);
        $submission->load(['album', 'photos', 'client']);

        return response()->json($submission);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            abort(403, 'Only clients can submit selections');
        }

        $data = $request->validate([
            'album_id' => ['required', 'uuid', Rule::exists('albums', 'id')],
            'selected_photos' => ['required', 'array', 'min:1'],
            'selected_photos.*' => ['uuid', Rule::exists('photos', 'id')],
            'notes' => ['nullable', 'string'],
        ]);

        $album = Album::findOrFail($data['album_id']);

        $existing = Submission::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->first();

        $submission = DB::transaction(function () use ($album, $user, $data, $existing) {
            $submission = $existing ?? Submission::create([
                'album_id' => $album->id,
                'client_id' => $user->id,
                'status' => 'pending',
                'submitted_at' => now(),
                'notes' => $data['notes'] ?? null,
            ]);

            SubmissionPhoto::where('submission_id', $submission->id)->delete();

            foreach ($data['selected_photos'] as $index => $photoId) {
                /** @var Photo $photo */
                $photo = Photo::where('id', $photoId)->where('album_id', $album->id)->firstOrFail();
                SubmissionPhoto::create([
                    'submission_id' => $submission->id,
                    'photo_id' => $photo->id,
                    'selection_order' => $index + 1,
                ]);
            }

            $submission->update([
                'submitted_at' => now(),
                'notes' => $data['notes'] ?? null,
            ]);

            return $submission;
        });

        $submission->load(['photos', 'album', 'client']);

        $this->logActivity($request, 'submit_selection', 'submission', $submission->id, [
            'photo_count' => count($data['selected_photos']),
        ]);

        return response()->json($submission, 201);
    }

    public function update(Request $request, Submission $submission)
    {
        $this->authorizeSubmissionMutation($request, $submission);

        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'downloaded', 'completed'])],
            'selected_photos' => ['sometimes', 'array', 'min:1'],
            'selected_photos.*' => ['uuid', Rule::exists('photos', 'id')],
        ]);

        // Only creators/admins can change status; clients can update selections
        if (isset($data['status'])) {
            if (! in_array($request->user()->role, ['admin', 'creator'], true)) {
                abort(403, 'Unauthorized to change status');
            }

            $submission->update([
                'status' => $data['status'],
                'downloaded_at' => $data['status'] === 'downloaded' ? now() : $submission->downloaded_at,
            ]);
        }

        if (! empty($data['selected_photos'])) {
            if ($request->user()->role === 'client' && $request->user()->id !== $submission->client_id) {
                abort(403, 'Unauthorized');
            }

            SubmissionPhoto::where('submission_id', $submission->id)->delete();
            foreach ($data['selected_photos'] as $index => $photoId) {
                /** @var Photo $photo */
                $photo = Photo::where('id', $photoId)
                    ->where('album_id', $submission->album_id)
                    ->firstOrFail();

                SubmissionPhoto::create([
                    'submission_id' => $submission->id,
                    'photo_id' => $photo->id,
                    'selection_order' => $index + 1,
                ]);
            }

            $submission->update([
                'submitted_at' => now(),
                'status' => $submission->status === 'completed' ? 'completed' : 'pending',
            ]);
        }

        $this->logActivity($request, 'update_submission', 'submission', $submission->id, $data);

        return response()->json($submission->fresh(['photos', 'album', 'client']));
    }

    public function download(Request $request, Submission $submission)
    {
        $this->authorizeSubmissionMutation($request, $submission);

        $photos = $submission->photos()->get();
        if ($photos->isEmpty()) {
            return response()->json(['message' => 'No photos to download'], 400);
        }

        $zip = new ZipArchive();
        $zipName = Str::slug($submission->album->title ?? 'submission').'-'.$submission->id.'.zip';
        // Use storage disk to build a temp folder that works across OSes
        Storage::makeDirectory('temp');
        $zipPath = Storage::path('temp/'.$zipName);

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['message' => 'Unable to create archive'], 500);
        }

        $addedFiles = 0;
        $missing = [];
        foreach ($photos as $photo) {
            $relativePath = $this->resolvePhotoPath($photo);
            if (! $relativePath) {
                $missing[] = "Photo {$photo->id}: missing path";
                continue;
            }

            // Prefer "public/..." when files live on the public disk
            $candidates = [
                $relativePath,
                'public/'.$relativePath,
            ];

            $absolutePath = null;
            foreach ($candidates as $candidate) {
                if (Storage::exists($candidate)) {
                    $absolutePath = Storage::path($candidate);
                    $relativePath = $candidate;
                    break;
                }
            }

            // Fallback to public/storage symlink (common on Windows dev setups)
            if (! $absolutePath) {
                $publicCandidate = public_path('storage/'.$relativePath);
                if (File::exists($publicCandidate)) {
                    $absolutePath = $publicCandidate;
                }
            }

            if (! $absolutePath) {
                $missing[] = "Photo {$photo->id}: not found (tried: ".implode(', ', $candidates).', public/storage/'.$relativePath.')';
                continue;
            }

            if ($zip->addFile($absolutePath, basename($relativePath))) {
                $addedFiles++;
            }
        }

        $zip->close();

        if ($addedFiles === 0 || ! file_exists($zipPath)) {
            @unlink($zipPath);
            return response()->json([
                'message' => 'Unable to build archive; no files were added',
                'details' => array_slice($missing, 0, 5),
            ], 500);
        }

        return response()->download($zipPath, $zipName, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }

    private function resolvePhotoPath(Photo $photo): ?string
    {
        $raw = $photo->getRawOriginal('path') ?? $photo->path;
        if (! $raw) {
            return null;
        }

        // Normalize slashes for Windows paths and strip base URLs
        $raw = str_replace('\\', '/', $raw);
        $appUrl = rtrim(config('app.url'), '/');
        if ($appUrl && str_starts_with($raw, $appUrl)) {
            $raw = substr($raw, strlen($appUrl));
        }

        // Drop leading storage/public prefixes or /storage URL segments
        $raw = ltrim($raw, '/');
        $raw = preg_replace('#^storage/#', '', $raw);
        $raw = preg_replace('#^public/#', '', $raw);

        return trim($raw, '/');
    }

    private function authorizeSubmissionAccess(Request $request, Submission $submission): void
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'creator' && $submission->album->creator_id === $user->id) {
            return;
        }

        if ($user->role === 'client' && $submission->client_id === $user->id) {
            return;
        }

        abort(403, 'Unauthorized');
    }

    private function authorizeSubmissionMutation(Request $request, Submission $submission): void
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'creator' && $submission->album->creator_id === $user->id) {
            return;
        }

        abort(403, 'Unauthorized');
    }
}
