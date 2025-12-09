<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $teamLeadRole = Role::where('name', 'team_lead')->first();
        $memberRole = Role::where('name', 'team_member')->first();

        // Create Super Admin
        User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567889',
            'role_id' => $superAdminRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create Manager
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Manager',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'role_id' => $managerRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create Team Lead
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'teamlead@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567891',
            'role_id' => $teamLeadRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create Team Members
        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'member@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567892',
            'role_id' => $memberRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        User::create([
            'first_name' => 'Mike',
            'last_name' => 'Johnson',
            'email' => 'mike@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567893',
            'role_id' => $memberRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        User::create([
            'first_name' => 'Sarah',
            'last_name' => 'Wilson',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567894',
            'role_id' => $memberRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }
}
