<?php

use Illuminate\Database\Seeder;

class CompteursTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(\App\Compteur::class, 40)->create();
    }
}
