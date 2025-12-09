<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('team_lead_id')->constrained('users');
            $table->integer('max_members')->default(10);
            $table->enum('status', ['active', 'inactive', 'disbanded'])->default('active');
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'status']);
            $table->index('team_lead_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('teams');
    }
};
