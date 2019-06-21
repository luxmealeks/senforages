
@extends ('layout.dashboard.default')
@section('content')
    <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}>


<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category"> Liste des consommations
                      <a href="{{route('consommations.create')}}"><div class="btn btn-warning">Nouvelle consommation <i class="material-icons">add</i></div></a>
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                  <div class="table-responsive">
                    <table class="table" id="tableconsommations">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Date consommation
                          </th>
                        <th>
                          N° Serie compteur
                        </th>

                           {{-- <th>
                          Détails
                          </th> --}}
                           <th>
                          Nom
                          </th>
                         <th>
                          Prenom
                          </th>
                           <th>
                          Action
                          </th>

                      </thead>
                      <tbody>
                        {{-- code ici   $consommation->load('compteur.abonnement.client.user');--}}
                      </tbody>

                    </table>
                    {{-- {{ $users->links() }} --}}
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

          $('#tableconsommations').DataTable( {
            "processing": true,
            "serverSide": true,
            "ajax": "{{route('consommations.list')}}",
            columns: [
                    { data: 'id', name: 'id' },
                    { data: 'date', name: 'date' },
                    { data: 'compteur.numero_serie', name: 'compteur.numero_serie' },
                    // { data: 'compteur.abonnement.details', name: 'compteur.abonnement.details' },
                    { data: 'compteur.abonnement.client.user.name', name: 'compteur.abonnement.client.user.name' },
                    { data: 'compteur.abonnement.client.user.firstname', name:'compteur.abonnement.client.user.firstname' },
                    { data: null ,orderable: false, searchable: false}

                ],
                "columnDefs": [
                        {
                        "data": null,
                        "render": function (data, type, row) {
                        url_e =  "{!! route('consommations.edit',':id')!!}".replace(':id', data.id);
                        url_d =  "{!! route('consommations.destroy',':id')!!}".replace(':id', data.id);
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

