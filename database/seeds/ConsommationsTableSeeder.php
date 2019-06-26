<?php

use Illuminate\Database\Seeder;

class ConsommationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        factory(App\Consommation::class, 100)->create(['factures_id' => null]); //creation de consommations
    }
}
