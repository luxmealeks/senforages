<?php

/**
 * Created by Reliese Model.
 * Date: Tue, 28 May 2019 17:23:04 +0000.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class Commune.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property string                                   $nom
 * @property int                                      $arrondissements_id
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \App\Arrondissement                      $arrondissement
 * @property \Illuminate\Database\Eloquent\Collection $villages
 */
class Commune extends Eloquent
{
use \Illuminate\Database\Eloquent\SoftDeletes;use\App\Helpers\UuidForKey;

    protected $casts = [
        'arrondissements_id' => 'int',
    ];

    protected $fillable = [
        'uuid',
        'nom',
        'arrondissements_id',
    ];

    public function arrondissement()
    {
        return $this->belongsTo(\App\Arrondissement::class, 'arrondissements_id');
    }

    public function villages()
    {
        return $this->hasMany(\App\Village::class, 'communes_id');
    }
}
