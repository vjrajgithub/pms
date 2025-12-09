<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Team;

class TeamPolicy
{
    /**
     * Determine if the user can view the team
     */
    public function view(User $user, Team $team)
    {
        // Super Admin and Admin can view all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can view teams they created
        if ($user->isManager()) {
            return $team->created_by === $user->id;
        }

        // Team Lead can view teams they lead
        if ($user->isTeamLead()) {
            return $team->team_lead_id === $user->id;
        }

        // Team Member can view their teams
        if ($user->isTeamMember()) {
            return $team->members()->where('user_id', $user->id)->where('status', 'active')->exists();
        }

        return false;
    }

    /**
     * Determine if the user can create a team
     */
    public function create(User $user)
    {
        // Super Admin, Admin, Manager can create
        return $user->isSuperAdmin() || $user->isAdmin() || $user->isManager();
    }

    /**
     * Determine if the user can update the team
     */
    public function update(User $user, Team $team)
    {
        // Super Admin and Admin can update all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can update teams they created
        if ($user->isManager()) {
            return $team->created_by === $user->id;
        }

        // Team Lead can update teams they lead
        if ($user->isTeamLead()) {
            return $team->team_lead_id === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can delete the team
     */
    public function delete(User $user, Team $team)
    {
        // Super Admin and Admin can delete all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can delete teams they created
        if ($user->isManager()) {
            return $team->created_by === $user->id;
        }

        // Team Lead can delete teams they lead
        if ($user->isTeamLead()) {
            return $team->team_lead_id === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can manage team members
     */
    public function manageMembers(User $user, Team $team)
    {
        // Super Admin and Admin can manage all
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return true;
        }

        // Manager can manage teams they created
        if ($user->isManager()) {
            return $team->created_by === $user->id;
        }

        // Team Lead can manage teams they lead
        if ($user->isTeamLead()) {
            return $team->team_lead_id === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can add members to the team
     */
    public function addMember(User $user, Team $team)
    {
        return $this->manageMembers($user, $team);
    }

    /**
     * Determine if the user can remove members from the team
     */
    public function removeMember(User $user, Team $team)
    {
        return $this->manageMembers($user, $team);
    }
}
