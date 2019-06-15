@extends('layout.dashboard.style')
{{-- @section('sidebarwrapper') --}}
            <ul class="nav">
                        <li class="nav-item active  ">
                            <a class="nav-link" href="./home">
                                <i class="material-icons">dashboard</i>
                                <p>Dashboard</p>
                            </a>
                        </li>

                        <li class="dropdown ">
                            <a class="nav-link" href="./users">
                                <i class="material-icons">people</i>
                                <p>Gestion des utilisateurs</p>
                            </a>
                        </li>

                        <li class="nav-item ">
                            <a class="nav-link" href="./compteurs">
                                <i class="material-icons">ac_unit</i>
                                <p>Gestion des compteurs</p>
                            </a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link" href="./villages">
                                <i class="material-icons">account_balance</i>
                                <p>Gestion des villages</p>
                            </a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link" href="./clients">
                                <i class="material-icons">person_pin</i></i>
                                <p>Gestion des clients</p>
                            </a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link" href="./factures">
                                <i class="material-icons">dehaze</i>
                                <p>Gestion des factures</p>
                            </a>
                        </li>

            </ul>
{{-- @endsection
 --}}
