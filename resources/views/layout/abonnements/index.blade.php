@extends ('layout.dashboard.default')
@include('layout.dashboard.style')


@include ('layout.dashboard.navbar')
@include('layout.dashboard.sidebar')
@yield('navbare')
<br><br><br>
@section('content')
    <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}>
