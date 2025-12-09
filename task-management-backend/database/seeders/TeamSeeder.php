<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Project;
use App\Models\User;

class TeamSeeder extends Seeder
{
    public function run()
    {
        $projects = Project::all();
        $teamLead = User::where('email', 'teamlead@example.com')->first();
        $members = User::where('role_id', 3)->get(); // Team members

        foreach ($projects as $project) {
            $team = Team::create([
                'name' => $project->name . ' Team',
                'description' => 'Development team for ' . $project->name,
                'project_id' => $project->id,
                'team_lead_id' => $teamLead->id,
                'status' => 'active',
                'max_members' => 10,
                'created_by' => $project->manager_id,
            ]);

            // Attach team to project via pivot for many-to-many relation
            if (method_exists($team, 'projects')) {
                $team->projects()->syncWithoutDetaching([$project->id]);
            }

            // Add team lead as member
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => $teamLead->id,
                'role' => 'lead',
                'joined_at' => now(),
                'status' => 'active',
            ]);

            // Add team members
            foreach ($members as $member) {
                TeamMember::create([
                    'team_id' => $team->id,
                    'user_id' => $member->id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'status' => 'active',
                ]);
            }
        }
    }
}
