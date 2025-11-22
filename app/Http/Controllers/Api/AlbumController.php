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

        $query = Album::with(['photos', 'creator']);

        if ($user->role === 'creator') {
            $query->where('creator_id', $user->id);
        } elseif ($user->role === 'client') {
            $accessibleAlbumIds = AlbumAccess::where('client_id', $user->id)->pluck('album_id');
            $submissionAlbumIds = Submission::where('client_id', $user->id)->pluck('album_id');
            $query->where(function ($q) use ($accessibleAlbumIds, $submissionAlbumIds) {
                $q->whereIn('id', $accessibleAlbumIds)
                    ->orWhereIn('id', $submissionAlbumIds)
                    ->orWhereNotNull('invite_code');
            });
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function show(Request $request, Album $album)
    {
        $this->authorizeAlbumAccess($request, $album);
        $album->load(['photos', 'creator', 'submissions']);

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
        ]);

        $album = Album::create([
            ...$data,
            'creator_id' => $user->role === 'creator' ? $user->id : $request->input('creator_id', $user->id),
        ]);

        $this->logActivity($request, 'create_album', 'album', $album->id, $data);

        return response()->json($album, 201);
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
        ]);

        $album->update($data);

        $this->logActivity($request, 'update_album', 'album', $album->id, $data);

        return response()->json($album);
    }

    public function destroy(Request $request, Album $album)
    {
        $this->authorizeAlbumMutation($request, $album);
        $album->delete();

        $this->logActivity($request, 'delete_album', 'album', $album->id);

        return response()->json(['message' => 'Album deleted']);
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
            ->where('invite_code', $code)
            ->firstOrFail();

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

        $hasAccess = AlbumAccess::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->exists();

        $hasSubmission = Submission::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->exists();

        if (! $hasAccess && ! $hasSubmission && ! $album->invite_code) {
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
