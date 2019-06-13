<?php

use Illuminate\Database\Seeder;

class AbonnementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       factory(\App\Abonnement::class, 10)->create();

    }
}
