<?php

namespace App\Console\Commands;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NormalizeMediaPaths extends Command
{
    protected $signature = 'media:normalize-paths';
    protected $description = 'Strip base URLs from stored album cover images and photo paths';

    public function handle(): int
    {
        $appUrl = rtrim(config('app.url'), '/');
        $storageBase = rtrim(Storage::url(''), '/');

        $this->info('Normalizing album cover_image_url values...');
        Album::chunk(200, function ($albums) use ($appUrl, $storageBase) {
            foreach ($albums as $album) {
                $original = $album->getRawOriginal('cover_image_url');
                $normalized = $this->stripBase($original, $appUrl, $storageBase);
                if ($original !== $normalized) {
                    $album->forceFill(['cover_image_url' => $normalized])->saveQuietly();
                    $this->line("Album {$album->id}: {$original} -> {$normalized}");
                }
            }
        });

        $this->info('Normalizing photo path values...');
        Photo::chunk(500, function ($photos) use ($appUrl, $storageBase) {
            foreach ($photos as $photo) {
                $original = $photo->getRawOriginal('path');
                $normalized = $this->stripBase($original, $appUrl, $storageBase);
                if ($original !== $normalized) {
                    $photo->forceFill(['path' => $normalized])->saveQuietly();
                    $this->line("Photo {$photo->id}: {$original} -> {$normalized}");
                }
            }
        });

        $this->info('Normalization complete.');

        return Command::SUCCESS;
    }

    private function stripBase(?string $value, string $appUrl, string $storageBase): ?string
    {
        if (empty($value)) {
            return $value;
        }

        $value = trim($value);

        if ($appUrl && Str::startsWith($value, $appUrl)) {
            $value = ltrim(Str::after($value, $appUrl), '/');
        }

        if ($storageBase && Str::startsWith($value, $storageBase)) {
            $value = ltrim(Str::after($value, $storageBase), '/');
        }

        return $value;
    }
}
