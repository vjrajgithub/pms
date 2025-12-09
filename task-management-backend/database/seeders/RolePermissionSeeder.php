<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User Management
            ['name' => 'users.create', 'display_name' => 'Create Users', 'category' => 'users'],
            ['name' => 'users.view', 'display_name' => 'View Users', 'category' => 'users'],
            ['name' => 'users.update', 'display_name' => 'Update Users', 'category' => 'users'],
            ['name' => 'users.delete', 'display_name' => 'Delete Users', 'category' => 'users'],
            ['name' => 'users.manage_roles', 'display_name' => 'Manage User Roles', 'category' => 'users'],

            // Team Management
            ['name' => 'teams.create', 'display_name' => 'Create Teams', 'category' => 'teams'],
            ['name' => 'teams.view', 'display_name' => 'View Teams', 'category' => 'teams'],
            ['name' => 'teams.update', 'display_name' => 'Update Teams', 'category' => 'teams'],
            ['name' => 'teams.delete', 'display_name' => 'Delete Teams', 'category' => 'teams'],
            ['name' => 'teams.manage_members', 'display_name' => 'Manage Team Members', 'category' => 'teams'],

            // Project Management
            ['name' => 'projects.create', 'display_name' => 'Create Projects', 'category' => 'projects'],
            ['name' => 'projects.view', 'display_name' => 'View Projects', 'category' => 'projects'],
            ['name' => 'projects.update', 'display_name' => 'Update Projects', 'category' => 'projects'],
            ['name' => 'projects.delete', 'display_name' => 'Delete Projects', 'category' => 'projects'],
            ['name' => 'projects.manage_team', 'display_name' => 'Manage Project Teams', 'category' => 'projects'],

            // Task Management
            ['name' => 'tasks.create', 'display_name' => 'Create Tasks', 'category' => 'tasks'],
            ['name' => 'tasks.view', 'display_name' => 'View Tasks', 'category' => 'tasks'],
            ['name' => 'tasks.update', 'display_name' => 'Update Tasks', 'category' => 'tasks'],
            ['name' => 'tasks.delete', 'display_name' => 'Delete Tasks', 'category' => 'tasks'],
            ['name' => 'tasks.change_status', 'display_name' => 'Change Task Status', 'category' => 'tasks'],
            ['name' => 'tasks.assign', 'display_name' => 'Assign Tasks', 'category' => 'tasks'],

            // Comments & Files
            ['name' => 'comments.create', 'display_name' => 'Create Comments', 'category' => 'comments'],
            ['name' => 'comments.update', 'display_name' => 'Update Comments', 'category' => 'comments'],
            ['name' => 'comments.delete', 'display_name' => 'Delete Comments', 'category' => 'comments'],
            ['name' => 'files.upload', 'display_name' => 'Upload Files', 'category' => 'files'],
            ['name' => 'files.delete', 'display_name' => 'Delete Files', 'category' => 'files'],

            // Notifications & Reports
            ['name' => 'notifications.view', 'display_name' => 'View Notifications', 'category' => 'notifications'],
            ['name' => 'reports.view', 'display_name' => 'View Reports', 'category' => 'reports'],

            // System Management
            ['name' => 'roles.manage', 'display_name' => 'Manage Roles', 'category' => 'system'],
            ['name' => 'permissions.manage', 'display_name' => 'Manage Permissions', 'category' => 'system'],
            ['name' => 'settings.manage', 'display_name' => 'Manage Settings', 'category' => 'system'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        // Create roles
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Admin',
                'description' => 'Full access to everything across the entire system',
                'permissions' => $this->getAllPermissions(),
            ],
            [
                'name' => 'admin',
                'display_name' => 'Admin',
                'description' => 'Can manage everything inside the organization',
                'permissions' => $this->getAdminPermissions(),
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manager',
                'description' => 'Can manage only the items they created',
                'permissions' => $this->getManagerPermissions(),
            ],
            [
                'name' => 'team_lead',
                'display_name' => 'Team Lead',
                'description' => 'Can manage tasks inside assigned projects',
                'permissions' => $this->getTeamLeadPermissions(),
            ],
            [
                'name' => 'team_member',
                'display_name' => 'Team Member',
                'description' => 'Can view and update assigned items',
                'permissions' => $this->getTeamMemberPermissions(),
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(
                ['name' => $roleData['name']],
                [
                    'display_name' => $roleData['display_name'],
                    'description' => $roleData['description'],
                    'permissions' => $roleData['permissions'],
                ]
            );

            // Sync permissions
            $permissionIds = Permission::whereIn('name', $roleData['permissions'])
                ->pluck('id')
                ->toArray();

            $role->permissions()->sync($permissionIds);
        }
    }

    /**
     * Get all permissions
     */
    private function getAllPermissions()
    {
        return Permission::pluck('name')->toArray();
    }

    /**
     * Get Admin permissions
     */
    private function getAdminPermissions()
    {
        return [
            'users.create',
            'users.view',
            'users.update',
            'users.delete',
            'teams.create',
            'teams.view',
            'teams.update',
            'teams.delete',
            'teams.manage_members',
            'projects.create',
            'projects.view',
            'projects.update',
            'projects.delete',
            'projects.manage_team',
            'tasks.create',
            'tasks.view',
            'tasks.update',
            'tasks.delete',
            'tasks.change_status',
            'tasks.assign',
            'comments.create',
            'comments.update',
            'comments.delete',
            'files.upload',
            'files.delete',
            'notifications.view',
            'reports.view',
        ];
    }

    /**
     * Get Manager permissions
     */
    private function getManagerPermissions()
    {
        return [
            'users.create',
            'users.view',
            'users.update',
            'users.delete',
            'teams.create',
            'teams.view',
            'teams.update',
            'teams.delete',
            'teams.manage_members',
            'projects.create',
            'projects.view',
            'projects.update',
            'projects.delete',
            'projects.manage_team',
            'tasks.create',
            'tasks.view',
            'tasks.update',
            'tasks.delete',
            'tasks.change_status',
            'tasks.assign',
            'comments.create',
            'comments.update',
            'comments.delete',
            'files.upload',
            'files.delete',
            'notifications.view',
            'reports.view',
        ];
    }

    /**
     * Get Team Lead permissions
     */
    private function getTeamLeadPermissions()
    {
        return [
            'projects.view',
            'projects.update',
            'projects.manage_team',
            'tasks.create',
            'tasks.view',
            'tasks.update',
            'tasks.change_status',
            'tasks.assign',
            'comments.create',
            'comments.update',
            'comments.delete',
            'files.upload',
            'files.delete',
            'notifications.view',
            'reports.view',
        ];
    }

    /**
     * Get Team Member permissions
     */
    private function getTeamMemberPermissions()
    {
        return [
            'projects.view',
            'tasks.view',
            'tasks.update',
            'tasks.change_status',
            'comments.create',
            'comments.update',
            'comments.delete',
            'files.upload',
            'files.delete',
            'notifications.view',
        ];
    }
}
