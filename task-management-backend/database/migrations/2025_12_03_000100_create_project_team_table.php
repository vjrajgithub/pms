<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('project_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['project_id', 'team_id']);
        });

        // Backfill existing one-to-many assignments from teams.project_id
        if (Schema::hasColumn('teams', 'project_id')) {
            DB::table('teams')
                ->whereNotNull('project_id')
                ->orderBy('id')
                ->chunkById(100, function ($teams) {
                    $now = now();
                    $rows = [];

                    foreach ($teams as $team) {
                        $exists = DB::table('project_team')
                            ->where('project_id', $team->project_id)
                            ->where('team_id', $team->id)
                            ->exists();

                        if (!$exists) {
                            $rows[] = [
                                'project_id' => $team->project_id,
                                'team_id'    => $team->id,
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];
                        }
                    }

                    if (!empty($rows)) {
                        DB::table('project_team')->insert($rows);
                    }
                });
        }
    }

    public function down()
    {
        Schema::dropIfExists('project_team');
    }
};
