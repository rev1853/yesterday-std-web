<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Photo extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'album_id',
        'path',
        'caption',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public $incrementing = false;
    protected $keyType = 'string';
    protected $appends = ['url'];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function submissionPhotos()
    {
        return $this->hasMany(SubmissionPhoto::class);
    }

    public function setPathAttribute($value): void
    {
        $this->attributes['path'] = $this->stripBaseUrl($value);
    }

    public function getPathAttribute($value): ?string
    {
        return $this->buildFullUrl($value);
    }

    public function getUrlAttribute(): ?string
    {
        $value = $this->attributes['path'] ?? null;

        return $this->buildFullUrl($value);
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
