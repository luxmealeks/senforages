<?php

namespace App\Http\Controllers;

use App\Reglement;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class ReglementController extends Controller
{
    public function list(Request $request)
    {
        $reglement = Reglement::get()->load('type', 'facture');

        // $reglement = Reglement::with('type')->get();
        // $reglement = Reglement::get();
        return Datatables::of($reglement)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('layout.reglements.index');
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
     * @param \App\Reglement $reglement
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Reglement $reglement)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Reglement $reglement
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Reglement $reglement)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Reglement           $reglement
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Reglement $reglement)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Reglement $reglement
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reglement $reglement)
    {
    }
}
