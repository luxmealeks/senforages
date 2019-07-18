
            <ul class="nav">
                {{-- @Roles('Administrateur') --}}
                        <li class="nav-item active  ">
                            <a class="nav-link" href="{{route('home')}}">
                                <i class="material-icons">dashboard</i>
                                <p>Dashboard</p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="{{route('users.index')}}">
                                <i class="material-icons">people</i>
                                <p>Utilisateurs</p>
                            </a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link" href="{{route('villages.index')}}">
                                <i class="material-icons">account_balance</i>
                                <p>Villages</p>
                            </a>

                        </li>

                        <li class="nav-item ">
                            <a class="nav-link" href="{{route('clients.index')}}">
                                <i class="material-icons">person_pin</i></i>
                                <p>Clients</p>
                            </a>
                        </li>
                        {{-- @endroles --}}
                        <li class="nav-item ">
                            <a class="nav-link" href="{{route('abonnements.index')}}">
                                <i class="material-icons">ac_unit</i>
                                <p>Abonnements</p>
                            </a>
                        </li>
                         <li class="nav-item ">
                            <a class="nav-link" href="{{route('compteurs.index')}}">
                                <i class="material-icons">ac_unit</i>
                                <p>Compteurs</p>
                            </a>
                        </li>
                            <li class="nav-item ">
                            <a class="nav-link" href="{{route('consommations.index')}}">
                                <i class="material-icons">dehaze</i>
                                <p>Consommations</p>
                            </a>
                        </li>
                         <li class="nav-item ">
                            <a class="nav-link" href="{{route('reglements.index')}}">
                                <i class="material-icons">dehaze</i>
                                <p>Réglements</p>
                            </a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link" href="{{route('factures.index')}}">
                                <i class="material-icons">dehaze</i>
                                <p>Factures</p>
                            </a>
                        </li>

            </ul>

