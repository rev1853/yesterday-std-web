<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'album_id',
        'client_id',
        'status',
        'submitted_at',
        'downloaded_at',
        'notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'downloaded_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function photos()
    {
        return $this->belongsToMany(Photo::class, 'submission_photos')
            ->withPivot(['id', 'selection_order'])
            ->withTimestamps();
    }

    public function submissionPhotos()
    {
        return $this->hasMany(SubmissionPhoto::class);
    }
}
