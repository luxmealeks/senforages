@extends ('layout.dashboard.default')
@section('content')
    <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}>

<div class="content">

        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">APPLICATION SENFORAGE</h4>
                  <p class="card-category"> liste des Abonnements</p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Nom
                        </th>
                        <th>
                            Chef
                        </th>
                        <th>
                          Info
                        </th>
                      </thead>
                      <tbody>

                          @foreach ($compteurs as $village)



                        <tr>
                          <td>
                            {{$village->id}}
                          </td>
                          <td>
                            {{$village->nom}}<br>
                            Region de {{$village->commune->arrondissement->departement->region->nom}}<br>
                            Commune de {{$village->commune->nom}}

                          </td>
                          <td>
                                {{$village->chef->user->name."  ".$village->chef->user->firstname}}
                          </td>
                          <td>
                              <a class="btn btn-primary" href={{route('compteurs.show',['village'=>$village->id])}}><i class="material-icons">edit</i> </a>
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
