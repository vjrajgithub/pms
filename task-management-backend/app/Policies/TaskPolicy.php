<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;

class TaskPolicy
{
    /**
     * Determine if the user can view the task
     */
    public function view(User $user, Task $task)
    {
        // Super Admin and Admin can view all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can view tasks in their projects
        if ($user->isManager()) {
            return $task->project()->where('manager_id', $user->id)->exists();
        }

        // Team Lead can view tasks in their projects
        if ($user->isTeamLead()) {
            return $task->project()->where('team_lead_id', $user->id)->exists();
        }

        // Team Member can view assigned tasks or tasks in their teams
        if ($user->isTeamMember()) {
            if ($task->assigned_to === $user->id) {
                return true;
            }

            return $task->project()->whereHas('teams.members', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('status', 'active');
            })->exists();
        }

        return false;
    }

    /**
     * Determine if the user can create a task
     */
    public function create(User $user)
    {
        // Super Admin, Admin, Manager, Team Lead can create
        return $user->isSuperAdmin() || $user->isAdmin() || 
               $user->isManager() || $user->isTeamLead();
    }

    /**
     * Determine if the user can update the task
     */
    public function update(User $user, Task $task)
    {
        // Super Admin and Admin can update all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can update tasks in their projects
        if ($user->isManager()) {
            return $task->project()->where('manager_id', $user->id)->exists();
        }

        // Team Lead can update tasks in their projects
        if ($user->isTeamLead()) {
            return $task->project()->where('team_lead_id', $user->id)->exists();
        }

        // Team Member can update assigned tasks
        if ($user->isTeamMember()) {
            return $task->assigned_to === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can delete the task
     */
    public function delete(User $user, Task $task)
    {
        // Super Admin and Admin can delete all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can delete tasks in their projects
        if ($user->isManager()) {
            return $task->project()->where('manager_id', $user->id)->exists();
        }

        // Team Lead can delete tasks in their projects
        if ($user->isTeamLead()) {
            return $task->project()->where('team_lead_id', $user->id)->exists();
        }

        return false;
    }

    /**
     * Determine if the user can change task status
     */
    public function changeStatus(User $user, Task $task)
    {
        // Super Admin and Admin can change all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can change status in their projects
        if ($user->isManager()) {
            return $task->project()->where('manager_id', $user->id)->exists();
        }

        // Team Lead can change status in their projects
        if ($user->isTeamLead()) {
            return $task->project()->where('team_lead_id', $user->id)->exists();
        }

        // Team Member can change status of assigned tasks
        if ($user->isTeamMember()) {
            return $task->assigned_to === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can assign the task
     */
    public function assign(User $user, Task $task)
    {
        // Super Admin and Admin can assign all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can assign tasks in their projects
        if ($user->isManager()) {
            return $task->project()->where('manager_id', $user->id)->exists();
        }

        // Team Lead can assign tasks in their projects
        if ($user->isTeamLead()) {
            return $task->project()->where('team_lead_id', $user->id)->exists();
        }

        return false;
    }
}
