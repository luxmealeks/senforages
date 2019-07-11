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
    public function listfree()
    {
        $compteurs = Compteur::doesntHave('abonnement')->get();

        return DataTables::of($compteurs)->make(true);
    }

    public function index()
    {
        $compteurs = Compteur::all()->load(['abonnement.client.user'])->paginate(10);
        //$compteurs=Compteur::all()->paginate(10);
        return view('layout.compteurs.index', compact('compteurs'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        return view('layout.compteurs.createcompteur');
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
        Compteur::create($request->all());

        $this->validate(
            $request, [
                'numero_serie' => 'required|string|max:50',
            ]
        );

        return view('layout.compteurs.index');
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
    public function edit(Compteur $request)
    {
        $compteur_id = $request->input('compteur');
        $compteur = \App\Compteur::find($compteur_id);

        return view('layout.compteurs.edit', compact('compteur'));
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
