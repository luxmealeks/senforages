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
                  <p class="card-category"> Liste des Utilisateurs inscrits
                      <a href="{{route('users.create')}}"><div class="btn btn-warning">Nouvel utilisateur <i class="material-icons">add</i></div></a>
                  </p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">


                  <div class="table-responsive">
                    <table class="table" id="tableusers">
                      <thead class=" text-primary">
                        <th>
                          ID
                        </th>
                        <th>
                          Nom
                        </th>
                         <th>
                          Prenom
                          </th>
                           <th>
                          E-mail
                          </th>
                         <th>
                          Role
                          </th>
                           <th>
                          Action
                          </th>

                      </thead>
                      <tbody>
{{-- ce code ci-dessous est commenté parcequ'on utilise ajax pour charger les données --}}
                          {{-- @foreach ($users as $user)
                        <tr>
                          <td>
                            {{$user->id}}
                          </td>
                          <td>
                            {{$user->name}}<br>
                          </td>
                          <td>
                            {{$user->firstname}}<br>
                          </td>
                          <td>
                            {{$user->email}}<br>
                             </td>
                             {{-- <td>
                            {{$user->Nom->user->name."  ".$user->Prenom->user->firstname}}
                          </td> --}}
                          {{-- <td>
                              <a class="btn btn-primary" href={{route('users.show',['user'=>$user->id])}}><i class="material-icons">edit</i> </a>
                              <a class="btn btn-primary" href={{route('users.show',['user'=>$user->id])}}><i class="material-icons">delete</i> </a>

                          </td>


                        </tr> --}}
                        {{-- @endforeach --}}
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

          $('#tableusers').DataTable( {
            "processing": true,
            "serverSide": true,
            "ajax": "{{route('users.list')}}",
            columns: [
                    { data: 'id', name: 'id' },
                    { data: 'name', name: 'user.name' },
                    { data: 'firstname', name: 'user.firstname' },
                    { data: 'email', name: 'user.email' },
                    { data: 'role.name', ame: 'role.name' },
                    { data: null ,orderable: false, searchable: false}

                ],
                "columnDefs": [
                        {
                        "data": null,
                        "render": function (data, type, row) {
                        url_e =  "{!! route('users.edit',':id')!!}".replace(':id', data.id);
                        url_d =  "{!! route('users.destroy',':id')!!}".replace(':id', data.id);
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

 dom: 'lBfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
          "lengthMenu": [ 10, 25, 50, 75, 100 ]


        //   {
        //         extend: 'pdfHtml5',
        //         exportOptions: {
        //             columns: [ 0, 1, 2, 5 ]
        //         }
        //     },
        //     'colvis' pour masquer une colonne

          });
        //   $("#tableusers").off('click', '.btn-delete-client').on('click','.btn-delete-client', function(){
        //      var href=$(this).data('href'); //recuperer le code du bouton et le mettre dans le href
        //      $('#form-delete-client').attr('action',href);
        //        $('#modal-delete-client').modal();
        //   });

      });
      </script>


      @endpush

