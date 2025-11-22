<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'role' => 'admin',
            ],
            [
                'name' => 'John Photographer',
                'email' => 'creator@example.com',
                'role' => 'creator',
            ],
            [
                'name' => 'Jane Client',
                'email' => 'client@example.com',
                'role' => 'client',
            ],
        ];

        foreach ($users as $seedUser) {
            User::updateOrCreate(
                ['email' => $seedUser['email']],
                [
                    'name' => $seedUser['name'],
                    'password' => bcrypt('password'),
                    'role' => $seedUser['role'],
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
