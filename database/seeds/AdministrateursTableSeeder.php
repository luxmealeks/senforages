<?php

use Illuminate\Database\Seeder;

class AdministrateursTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(\App\Administrateur::class, 40)->create();
    }
}
