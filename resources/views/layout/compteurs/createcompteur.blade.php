@extends('layout.dashboard.default')

@section('content')
<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category">Ajout d'un compteur
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
                                    <div class="panel-heading">Ajouter un compteur</div>
                                    <br>
                                    <div class="panel-body">
                                        <form class="form-horizontal" method="POST" action="{{ route('compteurs.store') }}">
                                            {{ csrf_field() }}
                                            {{ method_field('POST') }}
                                            <div class="form-group">
                                                {{-- <label for="input-numero_serie" class="col-md-4 control-label">Numero de série du compteur</label> --}}
                                                <div class="col-md-6">
                                                <input type="text" name="numero_serie" class="form-control" id="input-numero_serie" aria-describedby="" placeholder="Entrer le numero de serie">



                                                </div>

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
