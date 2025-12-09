<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Traits\HasRoles;
use App\Traits\HasPermissions;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasPermissions;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'avatar',
        'role_id',
        'status',
        'email_verified_at',
        'two_factor_enabled',
        'timezone',
        'preferences'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'two_factor_enabled' => 'boolean',
        'two_factor_recovery_codes' => 'array',
        'preferences' => 'array',
    ];

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        // Ensure role is loaded
        if (!$this->role) {
            $this->load('role');
        }

        return [
            'role' => $this->role ? $this->role->name : null,
            'permissions' => $this->role ? $this->role->permissions : []
        ];
    }

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function managedProjects()
    {
        return $this->hasMany(Project::class, 'manager_id');
    }

    public function leadProjects()
    {
        return $this->hasMany(Project::class, 'team_lead_id');
    }

    public function leadTeams()
    {
        return $this->hasMany(Team::class, 'team_lead_id');
    }

    public function teamMemberships()
    {
        return $this->hasMany(TeamMember::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members')->withPivot('role', 'joined_at', 'status');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAvatarAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Convert relative path to full URL
        return url('storage/' . $value);
    }

    // Helper Methods
    public function hasPermission($permission, $action = null)
    {
        // Super Admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        // Load role with permissions if not already loaded
        if (!$this->role) {
            $this->load('role');
        }

        if (!$this->role) {
            return false;
        }

        // Get permissions - handle both array and JSON string formats
        $permissions = $this->role->permissions;
        if (is_string($permissions)) {
            $permissions = json_decode($permissions, true);
        }

        if (!is_array($permissions)) {
            return false;
        }

        // Support both old format (resource, action) and new format (resource.action)
        if ($action !== null) {
            // Old format: hasPermission('resource', 'action')
            $resource = $permission;
            if (!isset($permissions[$resource]) || !is_array($permissions[$resource])) {
                return false;
            }

            // Support action aliases so role-specific granular permissions still satisfy generic checks
            $actionAliases = [
                'read' => ['read', 'read_team', 'read_team_members', 'read_assigned'],
                'create' => ['create', 'create_team_member', 'create_team_lead'],
                'update' => ['update', 'update_team_member', 'update_team_lead', 'update_own'],
                'delete' => ['delete', 'delete_team_member', 'delete_team_lead', 'delete_own'],
                'assign' => ['assign', 'assign_to_team', 'assign_team_lead'],
                'manage' => ['manage', 'manage_members', 'manage_project'],
            ];

            $requiredActions = $actionAliases[$action] ?? [$action];
            foreach ($requiredActions as $candidate) {
                if (in_array($candidate, $permissions[$resource], true)) {
                    return true;
                }
            }
            return false;
        } else {
            // New format: hasPermission('resource.action')
            // Check if permission exists in user's permissions array
            return in_array($permission, $permissions, true);
        }
    }

    public function isSuperAdmin()
    {
        if (!$this->role) {
            $this->load('role');
        }
        return $this->role && $this->role->name === 'super_admin';
    }

    public function isAdmin()
    {
        if (!$this->role) {
            $this->load('role');
        }
        return $this->role && $this->role->name === 'admin';
    }

    public function isManager()
    {
        if (!$this->role) {
            $this->load('role');
        }
        return $this->role && $this->role->name === 'manager';
    }

    public function isTeamLead()
    {
        if (!$this->role) {
            $this->load('role');
        }
        return $this->role && $this->role->name === 'team_lead';
    }

    public function isTeamMember()
    {
        if (!$this->role) {
            $this->load('role');
        }
        return $this->role && $this->role->name === 'team_member';
    }

    public function canAccessProject($projectId)
    {
        if ($this->isManager()) {
            return true;
        }

        if ($this->isTeamLead()) {
            return $this->leadProjects()->where('id', $projectId)->exists();
        }

        return $this->teams()->whereHas('project', function ($query) use ($projectId) {
            $query->where('id', $projectId);
        })->exists();
    }

    public function canAccessTeam($teamId)
    {
        if ($this->isManager()) {
            return true;
        }

        if ($this->isTeamLead()) {
            return $this->leadTeams()->where('id', $teamId)->exists();
        }

        return $this->teamMemberships()->where('team_id', $teamId)->where('status', 'active')->exists();
    }
}
