<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (! $this->hasUniqueIndex($table, 'submissions_album_client_unique')) {
                $table->unique(['album_id', 'client_id'], 'submissions_album_client_unique');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropUnique('submissions_album_client_unique');
        });
    }

    private function hasUniqueIndex(Blueprint $table, string $index): bool
    {
        return collect(Schema::getIndexes($table->getTable()))->contains(function ($idx) use ($index) {
            return isset($idx['name']) && $idx['name'] === $index;
        });
    }
};
