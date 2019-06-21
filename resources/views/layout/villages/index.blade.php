@extends ('layout.dashboard.default')
{{-- @extends('layouts.app') --}}
@section('content')

<div class="content">

        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">APPLICATION SENFORAGE</h4>
                  <p class="card-category"> liste des Villages</p>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table" id="tablevillages">
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

                          @foreach ($villages as $village)



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
                              <a class="btn btn-primary" href={{route('villages.show',['village'=>$village->id])}}><i class="material-icons">edit</i> </a>
                          </td>

                        </tr>
                        @endforeach
                      </tbody>

                    </table>
                    {{ $villages->links() }}
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

{{--
      @push('scripts')

  <script type="text/javascript">
      $(document).ready(function () {

          $('#tablevillages').DataTable( {
            "processing": true,
            "serverSide": true,
            "ajax": "{{route('villages.list')}}",
            columns: [
                    { data: 'id', name: 'id' },
                    { data: 'name', name: 'user.name' },
                    { data: 'firstname', name: 'user.firstname' },
                    { data: 'infos', ame: 'role.name' },
                    { data: null ,orderable: false, searchable: false}

                ],
                "columnDefs": [
                        {
                        "data": null,
                        "render": function (data, type, row) {
                        url_e =  "{!! route('villages.edit',':id')!!}".replace(':id', data.id);
                        url_d =  "{!! route('villages.destroy',':id')!!}".replace(':id', data.id);
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


      @endpush --}}
