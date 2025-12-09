<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;

class TaskSeeder extends Seeder
{
    public function run()
    {
        $projects = Project::with('teams')->get();
        $teamLead = User::where('email', 'teamlead@example.com')->first();
        $members = User::where('role_id', 3)->get();

        $taskTitles = [
            'Setup Development Environment',
            'Design Database Schema',
            'Implement User Authentication',
            'Create API Endpoints',
            'Build Frontend Components',
            'Write Unit Tests',
            'Setup CI/CD Pipeline',
            'Performance Optimization',
            'Security Audit',
            'Documentation Update',
            'Bug Fixes and Improvements',
            'Code Review and Refactoring',
        ];

        $taskDescriptions = [
            'Setup the development environment with all necessary tools and dependencies',
            'Design and implement the database schema for the application',
            'Implement secure user authentication system with JWT',
            'Create RESTful API endpoints for all required functionality',
            'Build responsive frontend components using React and Material-UI',
            'Write comprehensive unit tests for all modules',
            'Setup continuous integration and deployment pipeline',
            'Optimize application performance and database queries',
            'Conduct security audit and fix vulnerabilities',
            'Update project documentation and user guides',
            'Fix reported bugs and implement improvements',
            'Review code quality and refactor where necessary',
        ];

        foreach ($projects as $project) {
            $team = $project->teams->first();
            
            for ($i = 0; $i < 8; $i++) {
                $assignedUser = $i % 2 == 0 ? $teamLead : $members->random();
                $status = ['pending', 'in_progress', 'completed'][array_rand(['pending', 'in_progress', 'completed'])];
                $priority = ['low', 'medium', 'high'][array_rand(['low', 'medium', 'high'])];
                
                Task::create([
                    'title' => $taskTitles[$i % count($taskTitles)],
                    'description' => $taskDescriptions[$i % count($taskDescriptions)],
                    'project_id' => $project->id,
                    'team_id' => $team->id,
                    'assigned_to' => $assignedUser->id,
                    'created_by' => $teamLead->id,
                    'status' => $status,
                    'priority' => $priority,
                    'progress' => $status === 'completed' ? 100 : ($status === 'in_progress' ? rand(20, 80) : 0),
                    'deadline' => now()->addDays(rand(7, 30)),
                    'estimated_hours' => rand(8, 40),
                    'completed_at' => $status === 'completed' ? now()->subDays(rand(1, 10)) : null,
                ]);
            }
        }
    }
}
