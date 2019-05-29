<?php

$factory->define(App\Region::class, function (Faker\Generator $faker) {
    return [
        'uuid' => $faker->uuid,
        'nom' => $faker->word,
    ];
});

$factory->define(App\Type::class, function (Faker\Generator $faker) {
    return [
        'uuid' => $faker->uuid,
        'name' => $faker->name,
    ];
});

$factory->define(App\Role::class, function (Faker\Generator $faker) {
    return [
        'uuid' => $faker->uuid,
        'name' => $faker->name,
    ];
});

$factory->define(App\Facture::class, function (Faker\Generator $faker) {
    return [
        'uuid' => $faker->uuid,
        'date_limite' => $faker->dateTimeBetween(),
        'details' => $faker->word,
        'montant' => $faker->randomFloat(),
        'debut_consommation' => $faker->dateTimeBetween(),
        'fin_consommation' => $faker->dateTimeBetween(),
    ];
});

