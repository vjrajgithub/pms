<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $manager = User::where('email', 'admin@example.com')->first();
        $teamLead = User::where('email', 'teamlead@example.com')->first();

        Project::create([
            'name' => 'E-Commerce Platform',
            'description' => 'Development of a modern e-commerce platform with advanced features',
            'manager_id' => $manager->id,
            'team_lead_id' => $teamLead->id,
            'status' => 'in_progress',
            'priority' => 'high',
            'deadline' => now()->addMonths(3),
            'budget' => 50000.00,
            'created_by' => $manager->id,
        ]);

        Project::create([
            'name' => 'Mobile App Development',
            'description' => 'Cross-platform mobile application for task management',
            'manager_id' => $manager->id,
            'team_lead_id' => $teamLead->id,
            'status' => 'planning',
            'priority' => 'medium',
            'deadline' => now()->addMonths(4),
            'budget' => 30000.00,
            'created_by' => $manager->id,
        ]);

        Project::create([
            'name' => 'Data Analytics Dashboard',
            'description' => 'Business intelligence dashboard for data visualization',
            'manager_id' => $manager->id,
            'team_lead_id' => $teamLead->id,
            'status' => 'completed',
            'priority' => 'low',
            'deadline' => now()->subMonths(1),
            'budget' => 20000.00,
            'created_by' => $manager->id,
        ]);
    }
}
