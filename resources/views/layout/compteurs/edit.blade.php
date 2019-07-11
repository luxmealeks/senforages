@extends('layout.dashboard.default')

@section('content')
<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category"> Modifier un compteur
                      {{-- <a href="{{route('compteurs.update')}}"><div class="btn btn-warning">Modifier Compteur <i class="material-icons">update</i></div></a> --}}
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
                                    {{-- <div class="panel-heading">Modifier un compteur</div> --}}
                                    <br>
                                    <div class="panel-body">
                                        <form class="form-horizontal" method="POST" action="{{ route('compteurs.update', $compteur->id) }}">
                                            {{ csrf_field() }}
                                            {{ method_field('PUT') }}
                                            <div class="form-group">
                                                <label for="numero_serie" class="col-md-4 control-label">Numero de série du compteur</label>
                                                <div class="col-md-6">
                                                    <input id="numero_serie" type="text" class="form-control" name="numero_serie" value="{{ $compteur->numero_serie }}" required autofocus>
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



