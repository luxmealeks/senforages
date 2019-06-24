<?php

namespace App\Http\Controllers;

use App\Facture;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class FactureController extends Controller
{
    // générer des fac(ures sur la page d'acceuil.

    public function stats(Request $request)
    {
        $cptr = Consommations::doesntHave('facture')->count();

        return Datatables::of($cptr)->make(true);
    }

    // fin génération de stats

    public function list(Request $request)
    {
        // $factures = Facture::with('user')->get();

        $factures = Facture::get();

        return Datatables::of($factures)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('layout.factures.index');
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
     * @param \App\Facture $facture
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Facture $facture)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Facture $facture
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Facture $facture)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Facture             $facture
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Facture $facture)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Facture $facture
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Facture $facture)
    {
    }
}
