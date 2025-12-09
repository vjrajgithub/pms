<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['pending', 'in_progress', 'review', 'completed', 'cancelled'])->default('pending');
            $table->datetime('deadline')->nullable();
            $table->integer('estimated_hours')->nullable();
            $table->integer('actual_hours')->nullable();
            $table->decimal('progress', 5, 2)->default(0.00); // 0-100%
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('parent_task_id')->nullable()->constrained('tasks');
            $table->enum('recurrence_type', ['none', 'daily', 'weekly', 'monthly'])->default('none');
            $table->json('recurrence_settings')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'status', 'priority']);
            $table->index(['assigned_to', 'status']);
            $table->index(['created_by', 'deadline']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};
