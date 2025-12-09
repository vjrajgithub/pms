<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can view another user
     */
    public function view(User $user, User $targetUser)
    {
        // Super Admin and Admin can view all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can view users they created
        if ($user->isManager()) {
            return $targetUser->created_by === $user->id || $targetUser->id === $user->id;
        }

        // Team Lead can view team members
        if ($user->isTeamLead()) {
            return $user->teams()->whereHas('members', function ($query) use ($targetUser) {
                $query->where('user_id', $targetUser->id)->where('status', 'active');
            })->exists() || $targetUser->id === $user->id;
        }

        // Team Member can view themselves and team members
        if ($user->isTeamMember()) {
            return $user->teams()->whereHas('members', function ($query) use ($targetUser) {
                $query->where('user_id', $targetUser->id)->where('status', 'active');
            })->exists() || $targetUser->id === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can create a user
     */
    public function create(User $user)
    {
        // Super Admin and Admin can create
        return $user->isSuperAdmin() || $user->isAdmin() || $user->isManager();
    }

    /**
     * Determine if the user can update a user
     */
    public function update(User $user, User $targetUser)
    {
        // Super Admin can update all except themselves
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Admin can update all except Super Admin
        if ($user->isAdmin()) {
            return !$targetUser->isSuperAdmin();
        }

        // Manager can update users they created or themselves
        if ($user->isManager()) {
            return $targetUser->created_by === $user->id || $targetUser->id === $user->id;
        }

        // Users can update themselves
        return $targetUser->id === $user->id;
    }

    /**
     * Determine if the user can delete a user
     */
    public function delete(User $user, User $targetUser)
    {
        // Super Admin can delete all except themselves
        if ($user->isSuperAdmin()) {
            return $targetUser->id !== $user->id;
        }

        // Admin can delete all except Super Admin and themselves
        if ($user->isAdmin()) {
            return !$targetUser->isSuperAdmin() && $targetUser->id !== $user->id;
        }

        // Manager can delete users they created
        if ($user->isManager()) {
            return $targetUser->created_by === $user->id && $targetUser->id !== $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can manage roles for a user
     */
    public function manageRoles(User $user, User $targetUser)
    {
        // Super Admin can manage all roles
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Admin can manage roles except Super Admin
        if ($user->isAdmin()) {
            return !$targetUser->isSuperAdmin();
        }

        return false;
    }

    /**
     * Determine if the user can change user status
     */
    public function changeStatus(User $user, User $targetUser)
    {
        // Super Admin and Admin can change all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can change status of users they created
        if ($user->isManager()) {
            return $targetUser->created_by === $user->id;
        }

        return false;
    }
}
