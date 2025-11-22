<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

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

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function submissionPhotos()
    {
        return $this->hasMany(SubmissionPhoto::class);
    }
}
