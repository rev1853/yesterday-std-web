<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'photo_id',
        'selection_order',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function photo()
    {
        return $this->belongsTo(Photo::class);
    }
}
