<?php

namespace App\Http\Controllers;

use App\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    public function list(Request $request)
    {
        $compteurs = Compteur::get();
        $abonnements = Abonnement::with(['client'.'user'.'compteur'])->get();

        return DataTables::of($abonnements)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('abonnement.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Abonnement $abonnement
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Abonnement $abonnement)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Abonnement $abonnement
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Abonnement $abonnement)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Abonnement          $abonnement
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Abonnement $abonnement)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Abonnement $abonnement
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Abonnement $abonnement)
    {
    }
}
