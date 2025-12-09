<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'project_id',
        'team_lead_id',
        'max_members',
        'status',
        'settings',
        'created_by'
    ];

    protected $casts = [
        'settings' => 'array'
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_team')->withTimestamps();
    }

    public function teamLead()
    {
        return $this->belongsTo(User::class, 'team_lead_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'team_members')->withPivot('role', 'joined_at', 'status');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function tasks()
    {
        // Tasks associated via the team's primary project (legacy behavior)
        return $this->hasMany(Task::class, 'project_id', 'project_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Accessors
    public function getActiveMembersCountAttribute()
    {
        return $this->teamMembers()->where('status', 'active')->count();
    }

    public function getIsFull()
    {
        return $this->active_members_count >= $this->max_members;
    }
}
