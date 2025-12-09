<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions',
        'is_active'
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    // Helper Methods
    public function hasPermission($resource, $action)
    {
        $permissions = $this->permissions;
        return isset($permissions[$resource]) && in_array($action, $permissions[$resource]);
    }

    public function getPermissionsForResource($resource)
    {
        return $this->permissions[$resource] ?? [];
    }
}
