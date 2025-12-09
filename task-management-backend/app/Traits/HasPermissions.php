<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasPermissions
{
    /**
     * Get all permissions for the user
     */
    public function getPermissions()
    {
        $cacheKey = "user_permissions_{$this->id}";

        return Cache::remember($cacheKey, 3600, function () {
            return $this->roles()
                ->with('permissions')
                ->get()
                ->pluck('permissions')
                ->flatten()
                ->unique('id')
                ->pluck('name')
                ->toArray();
        });
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission($permission)
    {
        // Super Admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        // Check if permission exists in user's permissions
        return in_array($permission, $this->getPermissions());
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission($permissions)
    {
        if (is_array($permissions)) {
            return collect($permissions)->some(fn($permission) => $this->hasPermission($permission));
        }
        return $this->hasPermission($permissions);
    }

    /**
     * Check if user has all of the given permissions
     */
    public function hasAllPermissions($permissions)
    {
        if (is_array($permissions)) {
            return collect($permissions)->every(fn($permission) => $this->hasPermission($permission));
        }
        return $this->hasPermission($permissions);
    }

    /**
     * Clear permission cache
     */
    public function clearPermissionCache()
    {
        Cache::forget("user_permissions_{$this->id}");
    }

    /**
     * Check if user can access a project
     */
    public function canAccessProject($projectId)
    {
        // Super Admin and Admin can access all
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return true;
        }

        // Manager can access their own projects
        if ($this->isManager()) {
            return \App\Models\Project::where('id', $projectId)
                ->where('manager_id', $this->id)
                ->exists();
        }

        // Team Lead can access projects they lead
        if ($this->isTeamLead()) {
            return \App\Models\Project::where('id', $projectId)
                ->where('team_lead_id', $this->id)
                ->exists();
        }

        // Team Member can access projects with their teams
        if ($this->isTeamMember()) {
            return \App\Models\Project::whereHas('teams.members', function ($query) {
                $query->where('user_id', $this->id)->where('status', 'active');
            })->where('id', $projectId)->exists();
        }

        return false;
    }

    /**
     * Check if user can access a task
     */
    public function canAccessTask($taskId)
    {
        // Super Admin and Admin can access all
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return true;
        }

        $task = \App\Models\Task::find($taskId);
        if (!$task) {
            return false;
        }

        // Manager can access tasks in their projects
        if ($this->isManager()) {
            return $task->project()->where('manager_id', $this->id)->exists();
        }

        // Team Lead can access tasks in their projects
        if ($this->isTeamLead()) {
            return $task->project()->where('team_lead_id', $this->id)->exists();
        }

        // Team Member can access assigned tasks
        if ($this->isTeamMember()) {
            return $task->assigned_to === $this->id || 
                   $task->project()->whereHas('teams.members', function ($query) {
                       $query->where('user_id', $this->id)->where('status', 'active');
                   })->exists();
        }

        return false;
    }

    /**
     * Check if user can access a team
     */
    public function canAccessTeam($teamId)
    {
        // Super Admin and Admin can access all
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return true;
        }

        $team = \App\Models\Team::find($teamId);
        if (!$team) {
            return false;
        }

        // Manager can access teams they created
        if ($this->isManager()) {
            return $team->created_by === $this->id;
        }

        // Team Lead can access teams they lead
        if ($this->isTeamLead()) {
            return $team->team_lead_id === $this->id;
        }

        // Team Member can access their teams
        if ($this->isTeamMember()) {
            return $team->members()->where('user_id', $this->id)->where('status', 'active')->exists();
        }

        return false;
    }

    /**
     * Get all accessible projects for the user
     */
    public function getAccessibleProjects()
    {
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return \App\Models\Project::all();
        }

        if ($this->isManager()) {
            return \App\Models\Project::where('manager_id', $this->id)->get();
        }

        if ($this->isTeamLead()) {
            return \App\Models\Project::where('team_lead_id', $this->id)->get();
        }

        if ($this->isTeamMember()) {
            return \App\Models\Project::whereHas('teams.members', function ($query) {
                $query->where('user_id', $this->id)->where('status', 'active');
            })->get();
        }

        return collect();
    }

    /**
     * Get all accessible tasks for the user
     */
    public function getAccessibleTasks()
    {
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return \App\Models\Task::all();
        }

        if ($this->isManager()) {
            return \App\Models\Task::whereHas('project', function ($query) {
                $query->where('manager_id', $this->id);
            })->get();
        }

        if ($this->isTeamLead()) {
            return \App\Models\Task::whereHas('project', function ($query) {
                $query->where('team_lead_id', $this->id);
            })->get();
        }

        if ($this->isTeamMember()) {
            return \App\Models\Task::where('assigned_to', $this->id)->get();
        }

        return collect();
    }
}
