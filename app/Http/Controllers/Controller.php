<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

abstract class Controller
{
    /**
     * Persist an activity log entry when available.
     */
    protected function logActivity(?Request $request, string $actionType, ?string $entityType = null, ?string $entityId = null, array $metadata = []): void
    {
        ActivityLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => $request?->user()?->id,
            'action_type' => $actionType,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata ?: null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'created_at' => now(),
        ]);
    }
}
