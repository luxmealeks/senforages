<?php

use Illuminate\Database\Seeder;

class AgentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(\App\Agent::class, 10)->create();
    }
}
