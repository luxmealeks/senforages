<?php

use Illuminate\Database\Seeder;

class AbonnementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(\App\Abonnement::class, 30)->create();
    }
}
