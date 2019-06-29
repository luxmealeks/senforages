<?php

/**
 * Created by Reliese Model.
 * Date: Tue, 28 May 2019 17:23:04 +0000.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class Facture.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property \Carbon\Carbon                           $date_limite
 * @property string                                   $details
 * @property float                                    $montant
 * @property \bigInteger                              $valeur_totale_consommee
 * @property \Carbon\Carbon                           $debut_consommation
 * @property \Carbon\Carbon                           $fin_consommation
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \Illuminate\Database\Eloquent\Collection $consommations
 * @property \Illuminate\Database\Eloquent\Collection $reglements
 */
class Facture extends Eloquent
{
    use \Illuminate\Database\Eloquent\SoftDeletes;
    use\App\Helpers\UuidForKey;

    protected $casts = [
        'montant' => 'float',
    ];

    protected $dates = [
        'date_limite',
        'debut_consommation',
        'fin_consommation',
    ];

    protected $fillable = [
        'uuid',
        'date_limite',
        'details',
        'montant',
        'valeur_totale_consommee',
        'debut_consommation',
        'fin_consommation',
    ];

    public function consommations()
    {
        return $this->hasMany(\App\Consommation::class, 'factures_id');
    }

    // public function reglements()
    // {
    //     return $this->hasMany(\App\Reglement::class, 'factures_id');
    // }

    public function reglement()
    {
        return $this->hasOne(\App\Reglement::class, 'factures_id');
    }

    // public function client()
    // {
    //     return $this->belongsTo(\App\Client::class, 'factures_id');
    // }

    public function compteur()
    {
        return $this->belongsTo(\App\Client::class, 'factures_id');
    }

    //fonction pour générer les Accessors & Mutators qui facilitent la création ici d'utilisteur pour facture.
    public function getUserAttribute()
    {
        return $this->consommations->first()->compteur->abonnement->client->user;
    }

    protected $appends = ['user'];
}
