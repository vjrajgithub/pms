<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;

class ProjectPolicy
{
    /**
     * Determine if the user can view the project
     */
    public function view(User $user, Project $project)
    {
        // Super Admin and Admin can view all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can view their own projects
        if ($user->isManager() && $project->manager_id === $user->id) {
            return true;
        }

        // Team Lead can view projects they lead
        if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
            return true;
        }

        // Team Member can view projects with their teams
        if ($user->isTeamMember()) {
            return $project->teams()->whereHas('members', function ($query) use ($user) {
                $query->where('users.id', $user->id)
                      ->where('team_members.status', 'active');
            })->exists();
        }

        return false;
    }

    /**
     * Determine if the user can create a project
     */
    public function create(User $user)
    {
        // Super Admin, Admin, Manager can create
        return $user->isSuperAdmin() || $user->isAdmin() || $user->isManager();
    }

    /**
     * Determine if the user can update the project
     */
    public function update(User $user, Project $project)
    {
        // Super Admin and Admin can update all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can update their own projects
        if ($user->isManager() && $project->manager_id === $user->id) {
            return true;
        }

        // Team Lead can update projects they lead
        if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can delete the project
     */
    public function delete(User $user, Project $project)
    {
        // Super Admin and Admin can delete all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can delete their own projects
        if ($user->isManager() && $project->manager_id === $user->id) {
            return true;
        }

        // Team Lead can delete projects they lead
        if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can manage team members in the project
     */
    public function manageTeam(User $user, Project $project)
    {
        // Super Admin and Admin can manage all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can manage their own projects
        if ($user->isManager() && $project->manager_id === $user->id) {
            return true;
        }

        // Team Lead can manage projects they lead
        if ($user->isTeamLead() && $project->team_lead_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can change project status
     */
    public function changeStatus(User $user, Project $project)
    {
        return $this->update($user, $project);
    }
}
