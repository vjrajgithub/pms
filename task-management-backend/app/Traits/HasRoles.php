<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRoles
{
    /**
     * Get all roles for the user
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Get primary role (from role_id column)
     */
    public function getPrimaryRole()
    {
        return $this->role;
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($roleName)
    {
        if (is_array($roleName)) {
            return $this->roles()->whereIn('name', $roleName)->exists();
        }
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        return $this->hasRole($roles);
    }

    /**
     * Check if user has all of the given roles
     */
    public function hasAllRoles($roles)
    {
        if (is_array($roles)) {
            return collect($roles)->every(fn($role) => $this->hasRole($role));
        }
        return $this->hasRole($roles);
    }

    /**
     * Assign a role to the user
     */
    public function assignRole($roleName, $assignedBy = null)
    {
        $role = Role::where('name', $roleName)->firstOrFail();
        
        $this->roles()->syncWithoutDetaching([$role->id]);
        
        if ($assignedBy) {
            $this->roles()->updateExistingPivot($role->id, [
                'assigned_by' => $assignedBy,
            ]);
        }

        return $this;
    }

    /**
     * Remove a role from the user
     */
    public function removeRole($roleName)
    {
        $role = Role::where('name', $roleName)->first();
        
        if ($role) {
            $this->roles()->detach($role->id);
        }

        return $this;
    }

    /**
     * Sync roles for the user
     */
    public function syncRoles($roleNames)
    {
        $roles = Role::whereIn('name', $roleNames)->pluck('id');
        $this->roles()->sync($roles);

        return $this;
    }

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin()
    {
        return $this->hasRole('super_admin');
    }

    /**
     * Check if user is Admin
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is Manager
     */
    public function isManager()
    {
        return $this->hasRole('manager');
    }

    /**
     * Check if user is Team Lead
     */
    public function isTeamLead()
    {
        return $this->hasRole('team_lead');
    }

    /**
     * Check if user is Team Member
     */
    public function isTeamMember()
    {
        return $this->hasRole('team_member');
    }

    /**
     * Get user's role level (for hierarchy checks)
     */
    public function getRoleLevel()
    {
        $levels = [
            'super_admin' => 5,
            'admin' => 4,
            'manager' => 3,
            'team_lead' => 2,
            'team_member' => 1,
        ];

        $userRoles = $this->roles()->pluck('name')->toArray();
        $maxLevel = 0;

        foreach ($userRoles as $role) {
            $level = $levels[$role] ?? 0;
            $maxLevel = max($maxLevel, $level);
        }

        return $maxLevel;
    }

    /**
     * Check if user has higher or equal role level
     */
    public function hasRoleLevel($level)
    {
        return $this->getRoleLevel() >= $level;
    }
}
