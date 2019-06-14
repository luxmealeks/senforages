<?php

use Illuminate\Database\Seeder;

class TypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $type1 = App\Type::firstOrCreate(['name' => 'Orange Money'], ['uuid' => Str::uuid()]);
        $type2 = App\Type::firstOrCreate(['name' => 'Wari'], ['uuid' => Str::uuid()]);
        $type3 = App\Type::firstOrCreate(['name' => 'Cash'], ['uuid' => Str::uuid()]);
        $type4 = App\Type::firstOrCreate(['name' => 'JoniJoni'], ['uuid' => Str::uuid()]);
    }
}
