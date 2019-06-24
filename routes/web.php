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

// Route::get('/temp/', function () {
//     return view('layout.dashboard.template');
// });
Route::get('/clients/list', 'ClientController@list')->name('clients.list');
Route::resource('clients', 'ClientController');

Route::get('/villages/list', 'VillageController@list')->name('villages.list');
Route::resource('villages', 'VillageController');

Route::resource('compteurs', 'CompteurController');

Route::get('/users/list', 'UserController@list')->name('users.list');

Route::resource('users', 'UserController');
Route::get('/users/', function () {
    return view('layout.users.index');
});

Route::get('/compteurs', function () {
    return view('layout.compteurs.index');
});
Route::get('/consommations/list/{abonnement?}', 'ConsommationController@list')->name('consommations.list');
Route::resource('consommations', 'ConsommationController');

Route::get('/abonnements', 'AbonnementController@list')->name('abonnements.list');
Route::resource('abonnements', 'CompteurController');
// Route::resource('/abonnements', 'AbonnementController');

Route::get('/abonnements/selectcompteur', 'AbonnementController@selectcompteur')->name('abonnements.selectcompteur');
Route::get('/abonnements/selectclient', 'AbonnementController@selectclient')->name('abonnements.selectclient');
Route::get('/compteurs/listfree', 'CompteurController@listfree')->name('compteurs.listfree');
Route::get('/compteurs/list', 'CompteurController@list')->name('compteurs.list');

Route::get('/factures/list', 'FactureController@list')->name('factures.list');
Route::resource('factures', 'FactureController');
