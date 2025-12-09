<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Make project_id nullable while keeping existing foreign key
        Schema::table('teams', function (Blueprint $table) {
            DB::statement('ALTER TABLE teams MODIFY project_id BIGINT UNSIGNED NULL');
        });
    }

    public function down()
    {
        // Revert project_id back to NOT NULL
        Schema::table('teams', function (Blueprint $table) {
            DB::statement('ALTER TABLE teams MODIFY project_id BIGINT UNSIGNED NOT NULL');
        });
    }
};
