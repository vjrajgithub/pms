<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('task_comments', function (Blueprint $table) {
            if (!Schema::hasColumn('task_comments', 'attachment_paths')) {
                $table->json('attachment_paths')->nullable()->after('parent_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('task_comments', function (Blueprint $table) {
            if (Schema::hasColumn('task_comments', 'attachment_paths')) {
                $table->dropColumn('attachment_paths');
            }
        });
    }
};
