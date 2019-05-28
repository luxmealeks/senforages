
@extends('layout.dashboard.style')
@extends('layout.dashboard.sidebar')
@extends('layouts.app')
@yield('navbare')

@section('content')
<div class="container-fluid">

                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
{{--                     @yield('layout.dashboard.maincontent')
 --}}                    @include('layout.dashboard.content')


    </div>
</div>


@endsection





