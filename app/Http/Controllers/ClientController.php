<?php

namespace App\Http\Controllers;

use App\Client;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class ClientController extends Controller
{
    public function list(Request $request)
    {
        $clients = Client::with('user')->get();

        return Datatables::of($clients)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('layout.clients.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        // $this->validate(
        //     $request, [
        //         'client' => 'required|exists:clients,id',
        //     ]);
        // $client_id=$request->input('client');
        // $client=\App\Client::find($client_id);
        return view('layout.clients.create');
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
        // //
        // $this->validate(
        //     $request, [
        //         'nom' => 'required|string|max:50',
        //         'prenom' => 'required|string|max:50',
        //         'email' => 'required|email|max:255|unique:users,email',
        //         'password' => 'required|string|max:50',
        //         'village' => 'required|exists:villages,id',
        //     ]
        // );
        // return view('layout.clients.index');
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Client $client
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Client $client)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Client $client
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $client = Client::find($id);
        $user = $client->user;

        return $user; //on le fait pour tester ce qu'il retourne.

        $message = 'modifier'.$client->user->name.''.$client->user->firstname.'Edition effectuée';

        return redirect()->route('clients.index')->with(compact('message'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Client              $client
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Client $client
     *
     * @return \Illuminate\Http\Response
     */
    // public function destroy(Client $client)
    public function destroy($id)
    {
        $client = Client::find($id);
        $client->delete();
        $message = $client->user->firstname.' '.$client->user->name.' a été supprimé(e)';

        return redirect()->route('clients.index')->with(compact('message'));
    }
}
