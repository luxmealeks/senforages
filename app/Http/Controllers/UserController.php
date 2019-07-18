<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

class UserController extends Controller
{
    public function list(Request $request)
    {
        $users = User::get()->load('role');

        return Datatables::of($users)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all()->load(['agent', 'administrateur', 'client', 'gestionnaire', 'comptable'])->paginate(10);

        return view('layout.users.index');

        // return view('layout.users.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('layout.users.create');
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
        // User::create($request->all());

        // return 'Utilisateur créé !';
        return view('layout.users.create');
    }

    /**
     * Display the specified resource.
     *
     * @param \App\User $user
     *
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return view('layout.users.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\User $user
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = User::find($id);

        $message = 'modifier'.$user->name.''.$user->firstname.'Edition effectuée';

        // return redirect()->route('clients.edit')->with(compact('message'));

        return view('layout.users.edit')->with(compact('user', 'id'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\User                $user
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $user->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\User $user
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        // $user = User::find($id);
        // $user->delete();
        // $message = $user->firstname.' '.$user->name.' a été supprimé(e)';

        // return redirect()->route('users.index')->with(compact('message'));
    }
}
