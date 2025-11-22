<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function platform(Request $request)
    {
        $this->authorizeAdmin($request);

        $row = DB::table('admin_platform_stats')->first();

        return response()->json($row);
    }

    public function creator(Request $request, User $creator)
    {
        $this->authorizeAdminOrSelfCreator($request, $creator);

        $row = DB::table('creator_dashboard_stats')
            ->where('creator_id', $creator->id)
            ->first();

        return response()->json($row);
    }

    public function client(Request $request, User $client)
    {
        $this->authorizeAdminOrSelfClient($request, $client);

        $row = DB::table('client_dashboard_stats')
            ->where('client_id', $client->id)
            ->first();

        return response()->json($row);
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Admin only');
        }
    }

    private function authorizeAdminOrSelfCreator(Request $request, User $creator): void
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'creator' && $user->id === $creator->id) {
            return;
        }

        abort(403, 'Unauthorized');
    }

    private function authorizeAdminOrSelfClient(Request $request, User $client): void
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'client' && $user->id === $client->id) {
            return;
        }

        abort(403, 'Unauthorized');
    }
}
