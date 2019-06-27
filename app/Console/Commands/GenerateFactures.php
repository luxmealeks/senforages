<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateFactures extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'command:name'; par defaut
    protected $signature = 'generate:factures';

    /**
     * The console command description.
     *
     * @var string
     */
    // protected $description = 'Command description'; faire la description
    protected $description = 'Commande Artisan pour générer les factures';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Génération en cours...');
        $compteurs = \App\Compteur::get();
        foreach ($compteurs as $key => $compteur) {
            $this->info('$compteur->$numero_serie');

            // code...
        }
        $this->info('Opération effecutée ...');
        // $bar = $this->output->createProgressBar(count($users));

        // $bar->start();

        // foreach ($users as $user) {
        //     $this->performTask($user);

        //     $bar->advance();
        // }

        // $bar->finish();

        //Exemple de generation de 100000 FACTURES pour faire apparaitre la barre de navigation.
        $bar = $this->output->createProgressBar(100000);
        $bar->start();
        for ($i = 0; $i < 100000; ++$i) {
            $bar->advance();
        }
        $bar->finish();
    }
}
