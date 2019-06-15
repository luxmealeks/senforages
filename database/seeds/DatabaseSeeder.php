<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RolesTableSeeder::class);
        $this->call(AgentsTableSeeder::class);
        $this->call(GestionnairesTableSeeder::class);
        $this->call(VillagesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(ClientsTableSeeder::class);
        $this->call(ArrondissementsTableSeeder::class);
        $this->call(ComptablesTableSeeder::class);
        $this->call(CompteursTableSeeder::class);
        $this->call(ConsommationsTableSeeder::class);
        $this->call(DepartementsTableSeeder::class);
        $this->call(FacturesTableSeeder::class);
        $this->call(TypesTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(ReglementsTableSeeder::class);

    }
}
