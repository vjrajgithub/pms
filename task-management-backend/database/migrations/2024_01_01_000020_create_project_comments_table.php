<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('project_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->text('comment')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('project_comments')->onDelete('cascade');
            $table->json('attachment_paths')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'created_at']);
            $table->index(['parent_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('project_comments');
    }
};
