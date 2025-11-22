<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function index(Request $request, Album $album)
    {
        $this->authorizeAlbumAccess($request, $album);

        return response()->json($album->photos()->orderBy('created_at')->get());
    }

    public function store(Request $request, Album $album)
    {
        $this->authorizeAlbumMutation($request, $album);

        $data = $request->validate([
            'photos' => ['sometimes', 'array'],
            'photos.*.path' => ['required', 'string'],
            'photos.*.caption' => ['nullable', 'string'],
            'photos.*.metadata' => ['nullable', 'array'],
            'files' => ['sometimes', 'array'],
            'files.*' => ['file', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
        ]);

        $created = [];

        // Handle uploaded files (bulk-friendly)
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $storedPath = $file->storeAs("albums/{$album->id}", $filename, 'public');

                $created[] = $album->photos()->create([
                    'path' => $storedPath,
                    'caption' => null,
                    'metadata' => [
                        'original_name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mime' => $file->getMimeType(),
                        'stored_path' => $storedPath,
                    ],
                ]);
            }
        }

        // Handle remote/URL-based photos
        if (!empty($data['photos'])) {
            foreach ($data['photos'] as $photoData) {
                $created[] = $album->photos()->create([
                    'path' => $photoData['path'],
                    'caption' => $photoData['caption'] ?? null,
                    'metadata' => $photoData['metadata'] ?? null,
                ]);
            }
        }

        $this->logActivity($request, 'add_photos', 'album', $album->id, ['count' => count($created)]);

        return response()->json($created, 201);
    }

    public function destroy(Request $request, Photo $photo)
    {
        $album = $photo->album;
        $this->authorizeAlbumMutation($request, $album);

        $photo->delete();

        $this->logActivity($request, 'delete_photo', 'photo', $photo->id);

        return response()->json(['message' => 'Photo deleted']);
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
        if ($user->role === 'admin' || ($user->role === 'creator' && $album->creator_id === $user->id)) {
            return;
        }

        $hasAccess = $album->access()->where('client_id', $user->id)->exists();
        $hasInvite = ! empty($album->invite_code);

        if (! $hasAccess && ! $hasInvite) {
            abort(403, 'Unauthorized');
        }
    }
}
