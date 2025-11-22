<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use App\Models\Submission;
use App\Models\SubmissionPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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

        return response()->json([
            'submission' => $submission->only(['id', 'status', 'album_id', 'client_id']),
            'photos' => $photos,
        ]);
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
