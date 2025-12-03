<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Album extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'creator_id',
        'title',
        'description',
        'event_date',
        'cover_image_url',
        'invite_code',
        'status',
        'is_public',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_public' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';
    protected $appends = ['cover_image_full_url'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function access()
    {
        return $this->hasMany(AlbumAccess::class);
    }

    public function setCoverImageUrlAttribute($value): void
    {
        $this->attributes['cover_image_url'] = $this->stripBaseUrl($value);
    }

    public function getCoverImageUrlAttribute($value): ?string
    {
        return $this->buildFullUrl($value);
    }

    public function getCoverImageFullUrlAttribute(): ?string
    {
        $raw = $this->getRawOriginal('cover_image_url');

        return $this->buildFullUrl($raw);
    }

    private function stripBaseUrl(?string $value): ?string
    {
        if (empty($value)) {
            return $value;
        }

        $value = trim($value);
        $appUrl = rtrim(config('app.url'), '/');
        $storageBase = rtrim(Storage::url(''), '/');

        if ($appUrl && Str::startsWith($value, $appUrl)) {
            $value = ltrim(Str::after($value, $appUrl), '/');
        }

        if ($storageBase && Str::startsWith($value, $storageBase)) {
            $value = ltrim(Str::after($value, $storageBase), '/');
        }

        return $value;
    }

    private function buildFullUrl(?string $value): ?string
    {
        if (empty($value)) {
            return $value;
        }

        if (Str::startsWith($value, ['http://', 'https://'])) {
            return $value;
        }

        return Storage::url($value);
    }
}
