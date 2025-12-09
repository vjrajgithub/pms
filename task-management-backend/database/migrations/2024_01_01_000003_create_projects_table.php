<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['planning', 'active', 'on_hold', 'completed', 'cancelled'])->default('planning');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->foreignId('manager_id')->constrained('users');
            $table->foreignId('team_lead_id')->nullable()->constrained('users');
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'priority']);
            $table->index(['manager_id', 'team_lead_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
};
