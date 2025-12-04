<?php

use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::get('public/testimonials', [TestimonialController::class, 'publicLatest']);
Route::get('public/albums/featured', [AlbumController::class, 'publicFeatured']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    Route::post('users', [UserController::class, 'store']);
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    Route::get('albums', [AlbumController::class, 'index']);
    Route::post('albums', [AlbumController::class, 'store']);
    Route::get('albums/{album}', [AlbumController::class, 'show']);
    Route::put('albums/{album}', [AlbumController::class, 'update']);
    Route::delete('albums/{album}', [AlbumController::class, 'destroy']);
    Route::post('albums/{album}/invite', [AlbumController::class, 'generateInvite']);
    Route::get('albums/code/{code}', [AlbumController::class, 'showByInviteCode']);

    Route::get('albums/{album}/photos', [PhotoController::class, 'index']);
    Route::post('albums/{album}/photos', [PhotoController::class, 'store']);
    Route::delete('photos/{photo}', [PhotoController::class, 'destroy']);

    Route::get('submissions', [SubmissionController::class, 'index']);
    Route::get('submissions/{submission}', [SubmissionController::class, 'show']);
    Route::post('submissions', [SubmissionController::class, 'store']);
    Route::put('submissions/{submission}', [SubmissionController::class, 'update']);
    Route::get('submissions/{submission}/download', [SubmissionController::class, 'download']);

    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::post('albums/{album}/testimonials', [TestimonialController::class, 'store']);
    Route::put('testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    Route::get('analytics/platform', [AnalyticsController::class, 'platform']);
    Route::get('analytics/creator/{creator}', [AnalyticsController::class, 'creator']);
    Route::get('analytics/client/{client}', [AnalyticsController::class, 'client']);
});
