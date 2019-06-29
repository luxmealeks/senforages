<?php

/**
 * Created by Reliese Model.
 * Date: Tue, 28 May 2019 17:23:04 +0000.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class Compteur.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property string                                   $numero_serie
 * @property int                                      $administrateurs_id
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \App\Administrateur                      $administrateur
 * @property \Illuminate\Database\Eloquent\Collection $abonnements
 * @property \Illuminate\Database\Eloquent\Collection $consommations
 */
class Compteur extends Eloquent
{
    use \Illuminate\Database\Eloquent\SoftDeletes;
    use\App\Helpers\UuidForKey;

    protected $casts = [
        'administrateurs_id' => 'int',
    ];

    protected $fillable = [
        'uuid',
        'numero_serie',
        'administrateurs_id',
    ];

    public function administrateur()
    {
        return $this->belongsTo(\App\Administrateur::class, 'administrateurs_id');
    }

    public function abonnement()
    {
        return $this->hasOne(\App\Abonnement::class, 'compteurs_id');
    }

    public function consommations()
    {
        return $this->hasMany(\App\Consommation::class, 'compteurs_id');
    }

    //generer l'objet user

    // public function getUserAttribute()
    // {
    //     return $this->administrateurs->first()->user;
    // }

    // protected $appends = ['user'];
    //fin

    public function getNouvelleConsommationAttribute()
    {
        return $this->consommations->where('facture', '=', null);  //lister toutes les consommations qui n'ont pas de factures.
    }

    //génération de facture.
    public function generateFacture()
    {
        $nouvelles_conso = $this->getNouvelleConsommationAttribute();
        //on peut faire un filtre sur la génération de factures si l'agent a au moins une facture
        if ($nouvelles_conso->count() > 0) {
            $facture = new \App\Facture(); //creer une facture
            $facture->details = 'generate auto...'; // pour mettre les details:
            //Ici on parcours les consommations
            $valeur = 0;
            foreach ($nouvelles_conso as $conso) {
                // $valeur = $valeur + $conso->valeur; //affectation des cons
                $valeur += $conso->valeur;
            }//fin parcours
            $facture->valeur_totale_consommee = $valeur; //enregistrement de la valeur
            $facture->montant = $valeur * 3; //calcul de la valeur totale

            $facture->save(); //enregistrer facture
            $facture->consommations()->saveMany($nouvelles_conso); //enregistrer toutes les factures des consommations

            // $facture->saveMany($nouvelles_conso); //enregistrer toutes les factures avec les mises à jour

            return $facture;
        }

        return null;
    }
}
