<?php

use Illuminate\Database\Seeder;

class ReglementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(\App\Reglement::class, 40)->create();
    }
}
