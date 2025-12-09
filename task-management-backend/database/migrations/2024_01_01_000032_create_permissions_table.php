<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create permissions table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'projects.create'
            $table->string('display_name'); // e.g., 'Create Projects'
            $table->text('description')->nullable();
            $table->string('category'); // e.g., 'projects', 'tasks', 'users'
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
        });

        // Create role_permissions pivot table
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['role_id', 'permission_id']);
            $table->index('role_id');
            $table->index('permission_id');
        });

        // Create user_roles table for multiple roles per user
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['user_id', 'role_id']);
            $table->index('user_id');
            $table->index('role_id');
        });

        // Create resource_access table to track ownership
        Schema::create('resource_access', function (Blueprint $table) {
            $table->id();
            $table->string('resource_type'); // 'project', 'task', 'team', 'user'
            $table->unsignedBigInteger('resource_id');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('owner_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->json('metadata')->nullable(); // Additional context
            $table->timestamps();

            $table->index(['resource_type', 'resource_id']);
            $table->index('created_by');
            $table->index('owner_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('resource_access');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
    }
};
