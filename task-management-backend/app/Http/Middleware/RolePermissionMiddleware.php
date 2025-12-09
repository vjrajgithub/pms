<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RolePermissionMiddleware
{
    public function handle(Request $request, Closure $next, $resource = null, $action = null)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // If no specific permission required, just check authentication
        if (!$resource || !$action) {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user->hasPermission($resource, $action)) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        return $next($request);
    }
}
