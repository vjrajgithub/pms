<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users');
            $table->enum('type', ['meeting', 'workspace', 'discussion', 'private'])->default('workspace');
            $table->integer('capacity')->default(50);
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index(['team_id', 'status']);
            $table->index('created_by');
        });
    }

    public function down()
    {
        Schema::dropIfExists('rooms');
    }
};
