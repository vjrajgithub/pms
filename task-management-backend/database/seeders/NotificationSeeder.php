<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Create sample notifications for each user
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Welcome to Task Management System',
                'message' => 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.',
                'type' => 'system',
                'priority' => 'medium',
                'data' => ['action' => 'welcome'],
                'is_read' => true,
                'read_at' => now()->subDays(1),
                'created_at' => now()->subDays(2),
            ]);

            Notification::create([
                'user_id' => $user->id,
                'title' => 'New Task Assigned',
                'message' => 'You have been assigned a new task: "Setup project environment". Please check your task list for details.',
                'type' => 'task_assigned',
                'priority' => 'high',
                'data' => ['task_id' => 1, 'task_title' => 'Setup project environment'],
                'is_read' => true,
                'read_at' => now()->subHours(3),
                'created_at' => now()->subHours(6),
            ]);

            Notification::create([
                'user_id' => $user->id,
                'title' => 'Team Meeting Reminder',
                'message' => 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.',
                'type' => 'deadline_reminder',
                'priority' => 'medium',
                'data' => ['meeting_time' => '10:00 AM', 'date' => 'tomorrow'],
                'is_read' => false,
                'created_at' => now()->subHours(2),
            ]);

            // Add one unread notification
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Project Update Available',
                'message' => 'A new update is available for your project. Click here to view the latest changes.',
                'type' => 'project_updated',
                'priority' => 'low',
                'data' => ['project_id' => 1, 'update_type' => 'feature'],
                'is_read' => false,
                'created_at' => now()->subMinutes(30),
            ]);
        }

        // Create some role-specific notifications
        $manager = User::whereHas('role', function($query) {
            $query->where('name', 'manager');
        })->first();

        if ($manager) {
            Notification::create([
                'user_id' => $manager->id,
                'title' => 'Monthly Report Ready',
                'message' => 'Your monthly performance report is ready for review. Click to access the detailed analytics.',
                'type' => 'report_ready',
                'priority' => 'high',
                'data' => ['report_type' => 'monthly', 'period' => date('Y-m')],
                'is_read' => false,
                'created_at' => now()->subHours(1),
            ]);
        }

        $teamLead = User::whereHas('role', function($query) {
            $query->where('name', 'team_lead');
        })->first();

        if ($teamLead) {
            Notification::create([
                'user_id' => $teamLead->id,
                'title' => 'Team Member Added',
                'message' => 'A new team member has been added to your team. Please help them get started.',
                'type' => 'team_updated',
                'priority' => 'medium',
                'data' => ['team_id' => 1, 'action' => 'member_added'],
                'is_read' => false,
                'created_at' => now()->subHours(4),
            ]);
        }
    }
}
