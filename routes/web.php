<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth.index');
});
// Route::get('/', function () {
//     return view('auth.login');
// });
// Route::get('/accueil/', function () {
//     return view('layout.dashboard.default');
// });

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/users/', function () {
    return view('layout.users.index');
});

// Route::get('/clients/list', 'ClientController@list')->name('clients.list');
// Route::get('/clients/create', 'ClientController@create')->name('clients.create');

Route::get('/users/list', 'UserController@list')->name('users.list');

Route::get('/users/', function () {
    return view('layout.users.index');
});
Route::resource('users', 'UserController');

Route::get('/villages/list', 'VillageController@list')->name('villages.list');
Route::get('/villages/createvillage', 'VillageController@create')->name('villages.createvillage');
Route::get('/villages/editvillage', 'VillageController@edit')->name('villages.editvillage');

Route::resource('villages', 'VillageController');

Route::get('/consommations/list/{abonnement?}', 'ConsommationController@list')->name('consommations.list');
Route::resource('consommations', 'ConsommationController');

Route::get('/abonnements/list', 'AbonnementController@list')->name('abonnements.list');
Route::get('/abonnements/selectcompteur', 'AbonnementController@selectcompteur')->name('abonnements.selectcompteur');
Route::get('/abonnements/selectclient', 'AbonnementController@selectclient')->name('abonnements.selectclient');
Route::get('/abonnements', function () {
    return view('layout.abonnements.selectclient');
});
Route::resource('abonnements', 'CompteurController');
Route::resource('abonnements', 'AbonnementController'); //afficher la liste des abonnements

Route::get('/clients/list', 'ClientController@list')->name('clients.list');
Route::get('/clients/selectvillage', 'ClientController@selectvillage')->name('clients.selectvillage');
Route::get('/clients/edit', 'ClientController@edit')->name('clients.edit');
// Route::get('/clients/create', 'ClientController@create')->name('clients.create');
// Route::get('/clients/update', 'ClientController@update')->name('clients.update');
// Route::get('/clients/store', 'ClientController@store')->name('clients.store');

Route::get('/clients/selectvillage', function () {
    return view('layout.clients.selectvillage');
})->name('clients.selectvillage');

Route::get('/clients/edit', function () {
    return view('layout.clients.edit');
})->name('clients.edit');
Route::get('/clients/create', function () {
    return view('layout.clients.create')->name('clients.create');
});
Route::resource('/clients', 'ClientController');

Route::get('compteurs', function () {
    return view('layout.compteurs.index');
});
Route::get('/compteurs/createcompteur', 'CompteurController@create')->name('compteurs.createcompteur');
// Route::get('/compteurs/edit/', 'CompteurController@edit')->name('compteurs.edit');
// Route::get('/compteurs/delete', 'CompteurController@delete')->name('compteurs.delete');
// Route::get('/compteurs/update', 'CompteurController@update')->name('compteurs.update');
// Route::get('/compteurs/store', 'CompteurController@store')->name('compteurs.store');

Route::get('/compteurs/list', 'CompteurController@list')->name('compteurs.list');
Route::get('/compteurs/listfree', 'CompteurController@listfree')->name('compteurs.listfree');
Route::resource('compteurs', 'CompteurController');

Route::get('/factures/list', 'FactureController@list')->name('factures.list');
Route::get('/factures/index', function () {
    return view('layout.factures.index');
});

Route::resource('factures', 'FactureController');

Route::get('/reglements/list/', 'ReglementController@list')->name('reglements.list');
// Route::get('reglements', function () {
//     return view('layout.reglements.index');
// });
Route::resource('reglements', 'ReglementController')->except('create');
Route::get('/reglements/create/{factures?}', 'ReglementController@create')->name('reglements.create');

Route::get('loginfor/{rolename?}', function ($rolename = null) {
    if (!isset($rolename)) {
        return view('auth.loginfor');
    } else {
        $role = App\Role::where('name', $rolename)->first();
        if ($role) {
            $user = $role->users()->first();
            Auth::login($user, true);

            return redirect()->route('home');
        }
    }

    return redirect()->route('login');
})->name('loginfor');
