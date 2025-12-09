<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Admin',
                'description' => 'Complete system access with all administrative privileges',
                'permissions' => json_encode([
                    'projects' => ['create', 'read', 'update', 'delete', 'assign_team_lead'],
                    'teams' => ['create', 'read', 'update', 'delete'],
                    'rooms' => ['create', 'read', 'update', 'delete'],
                    'tasks' => ['create', 'read', 'update', 'delete', 'assign'],
                    'users' => ['create', 'read', 'update', 'delete', 'manage_all_roles'],
                    'reports' => ['view_all', 'export'],
                    'notifications' => ['send_all'],
                    'settings' => ['manage'],
                    'system' => ['full_access']
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manager',
                'description' => 'Project management with team lead and team member management',
                'permissions' => json_encode([
                    'projects' => ['create', 'read', 'update', 'delete', 'assign_team_lead'],
                    'teams' => ['create', 'read', 'update', 'delete'],
                    'rooms' => ['create', 'read', 'update', 'delete'],
                    'tasks' => ['create', 'read', 'update', 'delete', 'assign'],
                    'users' => ['create_team_lead', 'create_team_member', 'read', 'update_team_lead', 'update_team_member', 'delete_team_lead', 'delete_team_member'],
                    'reports' => ['view_all', 'export'],
                    'notifications' => ['send_all'],
                    'settings' => ['manage_project']
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'team_lead',
                'display_name' => 'Team Lead',
                'description' => 'Team management with team member management only',
                'permissions' => json_encode([
                    'projects' => ['read'],
                    'teams' => ['read', 'update_own', 'manage_members'],
                    'rooms' => ['create', 'read', 'update_own', 'delete_own'],
                    'tasks' => ['create', 'read', 'update', 'assign_to_team'],
                    'users' => ['create_team_member', 'read_team_members', 'update_team_member'],
                    'reports' => ['view_team'],
                    'notifications' => ['send_team']
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'team_member',
                'display_name' => 'Team Member',
                'description' => 'Basic task management and collaboration capabilities',
                'permissions' => json_encode([
                    'projects' => ['read_assigned'],
                    'teams' => ['read_own'],
                    'rooms' => ['read_team', 'participate'],
                    'tasks' => ['read_assigned', 'update_own', 'comment'],
                    'users' => ['read_team_members'],
                    'reports' => ['view_own'],
                    'notifications' => ['receive']
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        DB::table('roles')->insert($roles);
    }
}
