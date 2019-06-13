<?php

/**
 * Created by Reliese Model.
 * Date: Tue, 28 May 2019 17:23:04 +0000.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class Agent.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property string                                   $matricule
 * @property int                                      $users_id
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \App\User                                $user
 * @property \Illuminate\Database\Eloquent\Collection $consommations
 */
class Agent extends Eloquent
{
use \Illuminate\Database\Eloquent\SoftDeletes;use\App\Helpers\UuidForKey;

    protected $casts = [
        'users_id' => 'int',
    ];

    protected $fillable = [
        'uuid',
        'matricule',
        'users_id',
    ];

    public function user()
    {
        return $this->belongsTo(\App\User::class, 'users_id');
    }

    public function consommations()
    {
        return $this->hasMany(\App\Consommation::class, 'agents_id');
    }
}
