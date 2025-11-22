<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Submission;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function publicLatest(Request $request)
    {
        $limit = (int) $request->integer('limit', 6);

        $testimonials = Testimonial::query()
            ->with([
                'client:id,name',
                'album:id,title',
            ])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function (Testimonial $t) {
                return [
                    'id' => $t->id,
                    'rating' => $t->rating,
                    'comment' => $t->comment,
                    'created_at' => $t->created_at,
                    'client_name' => $t->client?->name,
                    'album_title' => $t->album?->title,
                ];
            });

        return response()->json($testimonials);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $query = Testimonial::with([
            'client:id,name,email',
            'album:id,title,creator_id',
        ])->orderByDesc('created_at');

        if ($user->role === 'creator') {
            $query->whereHas('album', fn ($q) => $q->where('creator_id', $user->id));
        } elseif ($user->role === 'client') {
            $query->where('client_id', $user->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request, Album $album)
    {
        $user = $request->user();
        if ($user->role !== 'client') {
            abort(403, 'Only clients can leave testimonials');
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        $hasSubmitted = Submission::where('album_id', $album->id)
            ->where('client_id', $user->id)
            ->exists();

        if (! $hasSubmitted) {
            abort(403, 'Submit a selection before leaving a review');
        }

        $testimonial = Testimonial::updateOrCreate(
            [
                'album_id' => $album->id,
                'client_id' => $user->id,
            ],
            [
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]
        );

        $testimonial->load(['client:id,name,email', 'album:id,title,creator_id']);

        $this->logActivity($request, 'submit_testimonial', 'testimonial', $testimonial->id, [
            'album_id' => $album->id,
            'rating' => $testimonial->rating,
        ]);

        return response()->json($testimonial, 201);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $this->authorizeClientOrAdmin($request, $testimonial);

        $data = $request->validate([
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        $testimonial->update($data);
        $testimonial->load(['client:id,name,email', 'album:id,title,creator_id']);

        $this->logActivity($request, 'update_testimonial', 'testimonial', $testimonial->id, $data);

        return response()->json($testimonial);
    }

    public function destroy(Request $request, Testimonial $testimonial)
    {
        $this->authorizeClientOrAdmin($request, $testimonial);
        $testimonial->delete();

        $this->logActivity($request, 'delete_testimonial', 'testimonial', $testimonial->id);

        return response()->json(['message' => 'Testimonial deleted']);
    }

    private function authorizeClientOrAdmin(Request $request, Testimonial $testimonial): void
    {
        $user = $request->user();
        if ($user->role === 'admin' || $user->id === $testimonial->client_id) {
            return;
        }

        abort(403, 'Unauthorized');
    }
}
