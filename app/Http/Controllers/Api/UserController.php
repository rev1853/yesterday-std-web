<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        return response()->json(User::orderBy('name')->get());
    }

    public function show(Request $request, User $user)
    {
        $this->authorizeSelfOrAdmin($request, $user);

        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeSelfOrAdmin($request, $user);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'role' => ['sometimes', Rule::in(['admin', 'creator', 'client'])],
            'avatar_url' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['role']) && $request->user()->role !== 'admin') {
            unset($data['role']);
        }

        $user->update($data);

        $this->logActivity($request, 'update_user', 'user', (string) $user->id, $data);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorizeAdmin($request);
        $user->delete();

        $this->logActivity($request, 'delete_user', 'user', (string) $user->id);

        return response()->json(['message' => 'User deleted']);
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Admin only');
        }
    }

    private function authorizeSelfOrAdmin(Request $request, User $user): void
    {
        $authUser = $request->user();
        if ($authUser?->role !== 'admin' && $authUser?->id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
