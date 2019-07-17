@extends('layout.dashboard.default')

@section('content')
<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category">Ajout Village
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table" id="table-compteur">
                      <thead class=" text-primary">
                       <div class="container">
                        <div class="row">
                            <div class="col-md-8 col-md-offset-2">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Ajouter un village</div>
                                    <br>
                                    <div class="panel-body">
                                        <form class="form-horizontal" method="POST" action="{{ route('villages.store') }}">
                                            {{ csrf_field() }}
                                            {{ method_field('POST') }}
                                            <div class="form-group">
                                                {{-- <label for="input-numero_serie" class="col-md-4 control-label">Numero de série du compteur</label> --}}
                                                <div class="col-md-6">
                                                <input type="text" name="nom" class="form-control" id="input-nom" aria-describedby="" placeholder="Entrer le nom du village">

                                                {{-- <input type="text" name="{{'village->nom'}}" class="form-control" id="input-nom" aria-describedby="" placeholder="Entrer le nom du village">

                                                </div>
                                                <div class="col-md-6">
                                                <input type="text" name="{{'village->commune->nom'}}" class="form-control" id="input-nom" aria-describedby="" placeholder="Entrer le nom du village">

                                                </div>
                                                <div class="col-md-6">
                                                <input type="text" name="{{'village->commune->arrondissement->departement->nom'}}" class="form-control" id="input-nom" aria-describedby="" placeholder="Entrer le nom du village">

                                                </div>
                                                <div class="col-md-6">
                                                <input type="text" name="{{'village->commune->arrondissement->departement->->region->nom'}}" class="form-control" id="input-nom" aria-describedby="" placeholder="Entrer le nom du village">

                                                </div> --}}


                                                <div class="form-group">
                                                    <div class="col-md-8 col-md-offset-4">
                                                        <button type="submit" class="btn btn-primary">
                                                            Enregistrer
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      @endsection

