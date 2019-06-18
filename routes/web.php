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
    return view('auth.login');
});
Route::get('/accueil/', function () {
    return view('layout.dashboard.default');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/utilisateurs/', function () {
    return view('layout.utilisateurs.index');
});

// Route::get('/temp/', function () {
//     return view('layout.dashboard.template');
// });
Route::get('/clients/list', 'ClientController@list')->name('clients.list');
Route::resource('clients', 'ClientController');

Route::resource('villages', 'VillageController');

Route::get('/compteurs', function () {
    return view('layout.compteurs.createcompteur');
});


