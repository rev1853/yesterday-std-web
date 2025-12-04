<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumAccess;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AlbumController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Album::with(['photos', 'creator'])->withCount('photos');

        if ($user->role === 'creator') {
            $query->where('creator_id', $user->id);
        } elseif ($user->role === 'client') {
            $accessibleAlbumIds = AlbumAccess::where('client_id', $user->id)->pluck('album_id');
            $submissionAlbumIds = Submission::where('client_id', $user->id)->pluck('album_id');
            $query->where(function ($q) use ($accessibleAlbumIds, $submissionAlbumIds) {
                $q->where('is_public', true)
                    ->orWhereIn('id', $accessibleAlbumIds)
                    ->orWhereIn('id', $submissionAlbumIds);
            });
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function show(Request $request, Album $album)
    {
        $this->authorizeAlbumAccess($request, $album);
        $album->load(['photos', 'creator', 'submissions'])->loadCount('photos');

        return response()->json($album);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (! in_array($user->role, ['creator', 'admin'], true)) {
            abort(403, 'Only creators or admins can create albums');
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'cover_image_url' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'in:active,archived,pending'],
            'is_public' => ['sometimes', 'boolean'],
        ]);

        $album = Album::create([
            ...$data,
            'creator_id' => $user->role === 'creator' ? $user->id : $request->input('creator_id', $user->id),
        ]);

        $this->logActivity($request, 'create_album', 'album', $album->id, $data);

        return response()->json($album->load('creator')->loadCount('photos'), 201);
    }

    public function update(Request $request, Album $album)
    {
        $this->authorizeAlbumMutation($request, $album);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'event_date' => ['sometimes', 'nullable', 'date'],
            'cover_image_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'status' => ['sometimes', 'in:active,archived,pending'],
            'is_public' => ['sometimes', 'boolean'],
        ]);

        $album->update($data);

        $this->logActivity($request, 'update_album', 'album', $album->id, $data);

        return response()->json($album->load('creator')->loadCount('photos'));
    }

    public function destroy(Request $request, Album $album)
    {
        $this->authorizeAlbumMutation($request, $album);
        $album->delete();

        $this->logActivity($request, 'delete_album', 'album', $album->id);

        return response()->json(['message' => 'Album deleted']);
    }

    public function publicFeatured(Request $request)
    {
        $limit = (int) $request->integer('limit', 6);

        $albums = Album::query()
            ->where('is_public', true)
            ->where('status', 'active')
            ->with(['photos', 'creator'])
            ->withCount('photos')
            ->withAvg('testimonials', 'rating')
            ->orderByDesc('testimonials_avg_rating')
            ->orderByDesc('photos_count')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return response()->json($albums);
    }

    public function generateInvite(Request $request, Album $album)
    {
        $this->authorizeAlbumMutation($request, $album);

        $inviteCode = $this->generateUniqueInviteCode();
        $album->update(['invite_code' => $inviteCode]);

        $this->logActivity($request, 'generate_invite', 'album', $album->id, ['invite_code' => $inviteCode]);

        return response()->json(['invite_code' => $inviteCode]);
    }

    public function showByInviteCode(Request $request, string $code)
    {
        $album = Album::with(['photos', 'creator'])
            ->withCount('photos')
            ->where('invite_code', $code)
            ->firstOrFail();

        $user = $request->user();
        if ($user && $user->role === 'client') {
            AlbumAccess::firstOrCreate([
                'album_id' => $album->id,
                'client_id' => $user->id,
            ], [
                'permission' => 'view',
            ]);
        }

        return response()->json($album);
    }

    private function authorizeAlbumMutation(Request $request, Album $album): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $album->creator_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }

    private function authorizeAlbumAccess(Request $request, Album $album): void
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'creator' && $album->creator_id === $user->id) {
            return;
        }

        if ($album->is_public) {
            return;
        }

        $hasAccess = AlbumAccess::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->exists();

        $hasSubmission = Submission::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->exists();

        if (! $hasAccess && ! $hasSubmission) {
            abort(403, 'Unauthorized');
        }
    }

    private function generateUniqueInviteCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Album::where('invite_code', $code)->exists());

        return $code;
    }
}
