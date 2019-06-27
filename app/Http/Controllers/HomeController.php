<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
        // $this->middleware(roles::Administrateur|Gestionnaire);
        // $this->middleware(roles::Administrateur | Gestionnaire)->except(index, ....);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');

        // return view('layout.dashboard.home');
    }

    //cptr_Villages= Village::get->count(); compteur des villages;
    //compact ou peut les
}
