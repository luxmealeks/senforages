@extends ('layout.dashboard.default')
@section('content')
    {{-- <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}> --}}


<div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">SENFORAGE</h4>
                  <p class="card-category"> Factures
                      <a href="{{route('factures.create')}}"><div class="btn btn-warning">Nouvelle Facture <i class="material-icons">add</i></div></a>
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table" id="table-factures">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Date limite de paiement
                        </th>
                        <th>
                          Date  Debut de consommation
                        </th>
                        <th>
                         Date Fin de consommation
                        </th>
                        <th>
                          Valeur Totale Consommée
                          </th>
                          <th>
                          Prenom du client
                          </th>
                          <th>
                          Nom du client
                          </th>
                          <th>
                          Action
                          </th>
                      </thead>
                      <tbody>

                      </tbody>

                    </table>

                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">

            </div>
          </div>
        </div>
      </div>
      {{-- inserer code du bouton du modale modal-delete-client avec sa class--}}
      @if (session('message'))
                   <div class="alert alert-success">
                       {{ session('message') }}
                   </div>
                   @endif
<meta name="csrf-token" content="{{ csrf_token() }}" />

<div class="modal" id="modal-delete-client" tabindex="-1" role="dialog">
 <form method="POST" action="" id="form-delete-client">
    @csrf
    @method('DELETE')
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-danger">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</form>

      @endsection



      @push('scripts')

<script type="text/javascript">
      $(document).ready(function () {
          $('#table-factures').DataTable( {
            "processing": true,
            "serverSide": true,
            "ajax": "{{route('factures.list')}}",
            columns: [
                    { data: 'id', name: 'id' },
                    { data: 'date_limite', name: 'date_limite' },
                    { data: 'debut_consommation', name: 'debut_consommation' },
                    { data: 'fin_consommation', name: 'fin_consommation' },
                    { data: 'montant', name: 'montant' },
                    //  { data: 'valeur_totale_consommee', name: 'valeur_totale_consommee' },
                    { data: 'user.name', name: 'user.name' },
                    { data: 'user.firstname', name: 'user.firstname' },
                    { data: null ,orderable: false, searchable: false}
                ],
                "columnDefs": [
                        {
                        "data": null,
                        "render": function (data, type, row) {
                        url_e =  "{!! route('factures.show',':id')!!}".replace(':id', data.id);
                        url_d =  "{!! route('factures.destroy',':id')!!}".replace(':id', data.id);
                        return '<a href='+url_e+'  class="btn btn-primary" ><i class="material-icons">show</i></a>'+
                        '<div class="btn btn-danger delete btn-delete-client" data-href='+url_d+'><i class="material-icons">delete</i></div>';
                        },
                        "targets": 7
                        },
                    // {
                    //     "data": null,
                    //     "render": function (data, type, row) {
                    //         url =  "{!! route('factures.edit',':id')!!}".replace(':id', data.id);
                    //         return check_status(data,url);
                    //     },
                    //     "targets": 1
                    // }
                ],
       dom: 'lBfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
          "lengthMenu": [[ 10, 25, 50, 1000, -1], [10, 25, 50, 1000, "All" ]]
          });
          $("#table-factures").off('click', '.btn-delete-client').on('click','.btn-delete-client', function(){
             var href=$(this).data('href'); //recuperer le code du bouton et le mettre dans le href
             $('#form-delete-client').attr('action',href);
               $('#modal-delete-client').modal();
          });
      });
      </script>


      @endpush
