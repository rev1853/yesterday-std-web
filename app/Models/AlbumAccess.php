<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AlbumAccess extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'album_id',
        'client_id',
        'permission',
        'granted_at',
    ];

    protected $casts = [
        'granted_at' => 'datetime',
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
}
