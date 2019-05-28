<?php

/**
 * Created by Reliese Model.
 * Date: Tue, 28 May 2019 17:25:54 +0000.
 */

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Class User.
 *
 * @property int                                      $id
 * @property string                                   $uuid
 * @property string                                   $firstname
 * @property string                                   $name
 * @property string                                   $telephone
 * @property string                                   $email
 * @property \Carbon\Carbon                           $email_verified_at
 * @property string                                   $password
 * @property int                                      $roles_id
 * @property string                                   $deleted_at
 * @property \Carbon\Carbon                           $created_at
 * @property \Carbon\Carbon                           $updated_at
 * @property \App\Role                                $role
 * @property \Illuminate\Database\Eloquent\Collection $administrateurs
 * @property \Illuminate\Database\Eloquent\Collection $agents
 * @property \Illuminate\Database\Eloquent\Collection $clients
 * @property \Illuminate\Database\Eloquent\Collection $comptables
 * @property \Illuminate\Database\Eloquent\Collection $gestionnaires
 */
class User extends Eloquent
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $casts = [
        'roles_id' => 'int',
    ];

    protected $dates = [
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected $fillable = [
        'uuid',
        'firstname',
        'name',
        'telephone',
        'email',
        'email_verified_at',
        'password',
        'roles_id',
    ];

    public function role()
    {
        return $this->belongsTo(\App\Role::class, 'roles_id');
    }

    public function administrateur()
    {
        return $this->hasone(\App\Administrateur::class, 'users_id');
    }

    public function agent()
    {
        return $this->hasone(\App\Agent::class, 'users_id');
    }

    public function client()
    {
        return $this->hasone(\App\Client::class, 'users_id');
    }

    public function comptable()
    {
        return $this->hasone(\App\Comptable::class, 'users_id');
    }

    public function gestionnaire()
    {
        return $this->hasone(\App\Gestionnaire::class, 'users_id');
    }
}
