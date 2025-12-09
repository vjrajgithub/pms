<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  $roles
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $roles = null)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // If no specific role required, allow
        if (!$roles) {
            return $next($request);
        }

        // Parse roles (comma-separated)
        $requiredRoles = array_map('trim', explode(',', $roles));

        // Check if user has any of the required roles
        if (!$user->hasAnyRole($requiredRoles)) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => "You do not have the required role(s): {$roles}"
            ], 403);
        }

        return $next($request);
    }
}
