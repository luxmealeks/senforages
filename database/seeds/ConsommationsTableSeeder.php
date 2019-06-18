<?php

use Illuminate\Database\Seeder;

class ConsommationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Consommations::class, 10)->create();

    }
}
