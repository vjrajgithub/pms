<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('role', ['member', 'senior_member', 'coordinator'])->default('member');
            $table->date('joined_at');
            $table->date('left_at')->nullable();
            $table->enum('status', ['active', 'inactive', 'removed'])->default('active');
            $table->timestamps();
            
            $table->unique(['team_id', 'user_id']);
            $table->index(['team_id', 'status']);
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('team_members');
    }
};
