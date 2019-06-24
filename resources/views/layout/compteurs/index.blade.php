@extends ('layout.dashboard.default')
{{-- @extends('layouts.app') --}}

@section('content')
    <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}>


<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category"> Compteurs
                      <a href="{{route('compteurs.create')}}"><div class="btn btn-warning">Nouveau Compteur <i class="material-icons">add</i></div></a>
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">


                  <div class="table-responsive">
                    <table class="table" id="table-compteur">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Numero de série
                        </th>
                         <th>
                          Action
                          </th>

                      </thead>
                      <tbody>

                          {{-- @foreach ($compteurs as $compteur)


                        <tr>
                          <td>
                            {{$compteur->id}}
                          </td>
                          <td>
                            {{$compteur->numero_serie}}<br>
                          </td>

                          <td>
                              <a class="btn btn-primary" href={{route('compteurs.show',['compteur'=>$compteur->id])}}><i class="material-icons">edit</i> </a>
                              <a class="btn btn-primary" href={{route('compteurs.show',['compteur'=>$compteur->id])}}><i class="material-icons">delete</i> </a>

                          </td>


                        </tr>
                        @endforeach --}}
                      </tbody>

                    </table>
                    {{-- {{ $compteurs->links() }} --}}
                  </div>
                </div>
              </div>
            </div>
        <div class="col-md-12">
 </div>
          </div>
        </div>
      </div>
      @endsection




      @push('scripts')

  <script type="text/javascript">
      $(document).ready(function () {

          $('#table-compteur').DataTable( {
            "processing": true,
            "serverSide": true,
            "ajax": "{{route('compteurs.list')}}",
            columns: [
                    { data: 'id', name: 'id' },
                    { data: 'compteur.numero_serie', name: 'compteur.numero_serie' },
                    { data: null ,orderable: false, searchable: false}

                ],
                "columnDefs": [
                        {
                        "data": null,
                        "render": function (data, type, row) {
                        url_e =  "{!! route('compteurs.edit',':id')!!}".replace(':id', data.id);
                        url_d =  "{!! route('compteurs.destroy',':id')!!}".replace(':id', data.id);
                        return '<a href='+url_e+'  class=" btn btn-primary " ><i class="material-icons">edit</i></a>'+
                        '<a class="btn btn-danger" href='+url_d+'><i class="material-icons">delete</i></a>';
                        },
                        "targets": 5
                        },
                    // {
                    //     "data": null,
                    //     "render": function (data, type, row) {
                    //         url =  "{!! route('users.edit',':id')!!}".replace(':id', data.id);
                    //         return check_status(data,url);
                    //     },
                    //     "targets": 1
                    // }
                ],

          });
      });
      </script>


      @endpush
