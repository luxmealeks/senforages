@extends ('layout.dashboard.default')
@include('layout.dashboard.style')

@include ('layout.dashboard.navbar')
@include('layout.dashboard.sidebar')

@yield('navmenuSM')
@yield('navbare')
<br><br>

{{-- @extends('layouts.app') --}}
@section('content')

<div class="content">

        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">APPLICATION SENFORAGE</h4>
                  <p class="card-category"> Consommations</p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Numero de série
                        </th>

                      </thead>
                      <tbody>

                          @foreach ($compteurs as $compteur)



                        <tr>
                          <td>
                            {{$compteur->id}}
                          </td>
                          <td>
                            {{$compteur->numero_serie}}<br>
                            {{-- Region de {{$compteur->commune->arrondissement->departement->region->nom}}<br>
                            Commune de {{$compteur->commune->nom}} --}}

                          </td>
                          <td>
                                {{-- {{$compteur->chef->user->name."  ".$compteur->chef->user->firstname}} --}}
                                {{$compteur->numero_serie}}

                          </td>
                          <td>
                              <a class="btn btn-primary" href={{route('compteurs.show',['compteur'=>$compteur->id])}}><i class="material-icons">edit</i> </a>
                          </td>

                        </tr>
                        @endforeach
                      </tbody>

                    </table>
                    {{ $compteurs->links() }}
                  </div>
                </div>
              </div>
            </div>
