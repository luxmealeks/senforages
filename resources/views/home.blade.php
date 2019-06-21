{{-- @include('layout.dashboard.default') --}}

@include('layout.dashboard.default')
{{-- @include ('layout.dashboard.navbar')
@include('layout.dashboard.sidebar')
@extends('layouts.app')
@yield('navmenuSM') --}}
  {{-- @yield('navbare') --}}
{{-- @include('layouts.app') --}}
{{-- @include('layout.dashboard.jumbotron')
 --}}
@yield('navmenuSM')
@yield('navbare')

  <body>


 <div class="container-fluid">


{{-- <div>  <div class="wrapper ">
            <div class="main-panel">
                <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Enregistrement des villages</h1>
    <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
  </div>
</div> --}}

<br><br><br>

 @include('layout.dashboard.default')


</div>

</body>



