<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RolesTableSeeder extends Seeder
{
    public function run()
    {
        $role1 = App\Role::firstOrCreate(['name' => 'Agent'], ['uuid' => Str::uuid()]);
        $role2 = App\Role::firstOrCreate(['name' => 'Client'], ['uuid' => Str::uuid()]);
        $role3 = App\Role::firstOrCreate(['name' => 'Gestionnaire'], ['uuid' => Str::uuid()]);
        $role4 = App\Role::firstOrCreate(['name' => 'Comptable'], ['uuid' => Str::uuid()]);
        $role5 = App\Role::firstOrCreate(['name' => 'Administrateur'], ['uuid' => Str::uuid()]);
    }
}
