@extends('layout.dashboard.default')
@section('content')

<div class="content">

        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">APPLICATION SENFORAGE</h4>
                  <p class="card-category"> Modification
                      {{-- <a href="{{route('villages.edit')}}"><div class="btn btn-warning">Nouveau village <i class="material-icons">edit</i></div></a> --}}


                  </p>

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



                    <form method="POST" action="{{route('villages.store')}}">
                    {{ csrf_field() }}

                    {{-- <input type="hidden" name="village" value="{{$village->id}}" class="form-control" name="inputName" id="inputName" placeholder=""> --}}

                    <div class="form-group">
                        <label for="input-nom">Nom</label>
                        <input type="text" name="village" class="form-control" id="input-nom" aria-describedby="Nom" placeholder="Nom du village" >
                        <small id="input-nom-help" class="form-text text-muted">
                            @if ($errors->has('nom'))
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->get('nom') as $message)
                                    <li>{{ $message }}</li>
                                    @endforeach
                                </ul>
                            </div>
                            @endif
                        </small>
                    </div>


                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                </form>


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
                    { data: 'name', name: 'village.name' },
                    { data: 'firstname', name: 'village.firstname' },
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
                    //         url =  "{!! route('villages.edit',':id')!!}".replace(':id', data.id);
                    //         return check_status(data,url);
                    //     },
                    //     "targets": 1
                    // }
                ],

          });
      });
      </script>


      @endpush --}}
