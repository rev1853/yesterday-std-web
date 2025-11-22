<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'creator', 'client'])->default('client')->after('email');
            }

            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable()->after('password');
            }
        });

        Schema::create('albums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('creator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->string('invite_code')->nullable()->unique();
            $table->enum('status', ['active', 'archived', 'pending'])->default('active');
            $table->timestamps();
        });

        Schema::create('photos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('album_id');
            $table->string('path');
            $table->string('caption')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('album_id')
                ->references('id')
                ->on('albums')
                ->cascadeOnDelete();

            $table->index('album_id');
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('album_id');
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'downloaded', 'completed'])->default('pending');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('downloaded_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('album_id')
                ->references('id')
                ->on('albums')
                ->cascadeOnDelete();

            $table->index(['album_id', 'client_id']);
        });

        Schema::create('submission_photos', function (Blueprint $table) {
            $table->id();
            $table->uuid('submission_id');
            $table->uuid('photo_id');
            $table->unsignedInteger('selection_order')->nullable();
            $table->timestamps();

            $table->foreign('submission_id')
                ->references('id')
                ->on('submissions')
                ->cascadeOnDelete();

            $table->foreign('photo_id')
                ->references('id')
                ->on('photos')
                ->cascadeOnDelete();

            $table->unique(['submission_id', 'photo_id']);
        });

        Schema::create('album_access', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('album_id');
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('permission')->default('view');
            $table->timestamp('granted_at')->useCurrent();
            $table->timestamps();

            $table->foreign('album_id')
                ->references('id')
                ->on('albums')
                ->cascadeOnDelete();

            $table->index('album_id', 'idx_album_access_album');
            $table->index('client_id', 'idx_album_access_client');
            $table->unique(['album_id', 'client_id']);
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action_type', 50);
            $table->string('entity_type', 50)->nullable();
            $table->uuid('entity_id')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('user_id', 'idx_activity_logs_user');
            $table->index('action_type', 'idx_activity_logs_action');
            $table->index('created_at', 'idx_activity_logs_created');
        });

        DB::statement(<<<SQL
            CREATE VIEW creator_dashboard_stats AS
            SELECT 
              u.id as creator_id,
              u.name as creator_name,
              COUNT(DISTINCT a.id) as total_albums,
              COUNT(DISTINCT p.id) as total_photos,
              COUNT(DISTINCT s.id) as total_submissions,
              COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.id END) as pending_submissions
            FROM users u
            LEFT JOIN albums a ON u.id = a.creator_id
            LEFT JOIN photos p ON a.id = p.album_id
            LEFT JOIN submissions s ON a.id = s.album_id
            WHERE u.role = 'creator'
            GROUP BY u.id, u.name
        SQL);

        DB::statement(<<<SQL
            CREATE VIEW client_dashboard_stats AS
            SELECT 
              u.id as client_id,
              u.name as client_name,
              COUNT(DISTINCT s.album_id) as albums_accessed,
              COUNT(DISTINCT sp.photo_id) as total_photos_selected,
              COUNT(DISTINCT s.id) as total_submissions
            FROM users u
            LEFT JOIN submissions s ON u.id = s.client_id
            LEFT JOIN submission_photos sp ON s.id = sp.submission_id
            WHERE u.role = 'client'
            GROUP BY u.id, u.name
        SQL);

        DB::statement(<<<SQL
            CREATE VIEW admin_platform_stats AS
            SELECT 
              (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
              (SELECT COUNT(*) FROM users WHERE role = 'creator') as total_creators,
              (SELECT COUNT(*) FROM users WHERE role = 'client') as total_clients,
              (SELECT COUNT(*) FROM albums) as total_albums,
              (SELECT COUNT(*) FROM albums WHERE status = 'active') as active_albums,
              (SELECT COUNT(*) FROM photos) as total_photos,
              (SELECT COUNT(*) FROM submissions) as total_submissions,
              (SELECT COUNT(*) FROM submissions WHERE status = 'pending') as pending_submissions
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS admin_platform_stats');
        DB::statement('DROP VIEW IF EXISTS client_dashboard_stats');
        DB::statement('DROP VIEW IF EXISTS creator_dashboard_stats');

        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('album_access');
        Schema::dropIfExists('submission_photos');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('photos');
        Schema::dropIfExists('albums');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }

            if (Schema::hasColumn('users', 'avatar_url')) {
                $table->dropColumn('avatar_url');
            }
        });
    }
};
