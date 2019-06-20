<?php

namespace App\Http\Controllers;

use App\Compteur;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class CompteurController extends Controller
{
    public function list(Request $request)
    {
        $compteurs = Compteur::get();

        return Datatables::of($compteurs)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $compteurs = Compteur::all()->load(['abonnement.client.user'])->paginate(10);
        //  $compteurs=Compteur::all()->paginate(10);
        return view('layout.compteurs.index', compact('compteurs'));
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
     * @param \App\Compteur $compteur
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Compteur $compteur)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Compteur $compteur
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Compteur $compteur)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Compteur            $compteur
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Compteur $compteur)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Compteur $compteur
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Compteur $compteur)
    {
    }
}
