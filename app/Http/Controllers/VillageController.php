<?php

namespace App\Http\Controllers;

use App\Village;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class VillageController extends Controller
{
    public function list(Request $request)
    {
        $village = Village::with('clients')->get();

        return Datatables::of($village)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //echo ('ici page village');
        $villages = Village::all()->load(['chef.user', 'commune.arrondissement.departement.region'])->paginate(10);

        return view('layout.villages.index', compact('villages'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('layout.villages.createvillage');
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
        return view('layout.villages.createvillage');
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Village $village
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Village $village)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Village $village
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // $village = \App\Village::find($village_id);
        $village = Village::find($id);
        // $user = $client->user;

        // return $user; //on le fait pour tester ce qu'il retourne.

        $message = 'modifier'.$village->nom.'Edition effectuée';

        // return redirect()->route('clients.edit')->with(compact('message'));

        return view('layout.villages.editvillage');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Village             $village
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Village $village)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Village $village
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Village $village)
    {
    }
}
