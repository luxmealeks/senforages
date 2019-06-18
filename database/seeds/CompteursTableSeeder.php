<?php

use Illuminate\Database\Seeder;

class CompteursTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Compteurs::class, 40)->create();

    }
}
