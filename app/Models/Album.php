<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

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
}
