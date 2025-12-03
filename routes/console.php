<?php

use App\Console\Commands\NormalizeMediaPaths;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('media:normalize-paths', function (NormalizeMediaPaths $normalizer) {
    return $normalizer->handle();
})->purpose('Strip base URLs from stored album and photo paths');
