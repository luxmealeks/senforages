<?php

/**
 * generated by dev
 *using Reliese Model.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class Comptable.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property string                                   $matricule
 * @property int                                      $users_id
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \App\User                                $user
 * @property \Illuminate\Database\Eloquent\Collection $reglements
 */
class Comptable extends Eloquent
{
    use \Illuminate\Database\Eloquent\SoftDeletes;
    use \App\Helpers\UuidForKey;

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

    public function reglements()
    {
        return $this->hasMany(\App\Reglement::class, 'comptables_id');
    }
}
