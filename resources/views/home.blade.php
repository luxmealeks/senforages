@include ('layout.dashboard.style')

<body class="content">
    <div class="wrapper ">
        <div class="sidebar" data-color="green" data-background-color="white" data-image="{{asset('assets/img/sidebar-3.jpg')}}">
                    {{-- <div class="sidebar" data-color="green" data-background-color="white" data-image="{{asset('assets/img/sidebar-2.jpg')}}">
                        <div class="sidebar" data-color="green" data-background-color="white" data-image="{{asset('assets/img/sidebar-3.jpg')}}">
                                <div class="sidebar" data-color="green" data-background-color="white" data-image="{{asset('assets/img/sidebar-4.jpg')}}"> --}}

            <div class="logo">
                <a href="./home" class="simple-text logo-normal"> SenForage App</a>
            </div>
            <div class="sidebar-wrapper">
                @include ('layout.dashboard.sidebar-wrapper')
            </div>
        </div>

        <div class="main-panel">
            <!-- Navbar -->
            @include ('layout.dashboard.navbar')

            <!-- End Navbar -->

             <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card card-chart">
                                <div class="card-header card-header-success">
                                    <div class="ct-chart" id="dailySalesChart"></div>
                                </div>
                                <div class="card-body">
                                    <h4 class="card-title">Stats Abonnements</h4>
                                    <p class="card-category">
                                        <p class="card-category">{{App\Abonnement::count() }}</p>
                                        <p class="card-category">Demande client</p>
                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> SenForage
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card card-chart">
                                    <div class="card-header card-header-warning">
                                        <div class="ct-chart" id="websiteViewsChart"></div>
                                    </div>
                                    <div class="card-body">
                                        <h4 class="card-title">Stats Utilisateurs</h4>
                                        <p class="card-category">{{App\User::count() }}: </p>
                                        <p class="card-category">Details : </p>


                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> SenForage
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card card-chart">
                                    <div class="card-header card-header-danger">
                                        <div class="ct-chart" id="completedTasksChart"></div>
                                    </div>
                                    <div class="card-body">
                                        <h4 class="card-title">Stats Factures</h4>
                                        <p class="card-category">Nombre de factures</p>
                                        <p class="card-category">{{App\Client::count() }} </p>

                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> SenForage
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="">
                            <div class="card">
                                <div class="card-header card-header-warning">
                                    <h4 class="card-title">Recouvrements de factures</h4>
                                    <p class="card-category">Status des factures</p>
                                </div>
                                <div class="card-body table-responsive">
                                    <table class="table table-hover">
                                        <thead class="text-warning">
                                            <th>ID</th>
                                            <th>Nom client</th>
                                             <th>Prenom du client</th>
                                            <th>Montat</th>
                                            <th>Statut</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Dakota Rice</td>
                                                <td>$36,738</td>
                                                <td>Niger</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Minerva Hooper</td>
                                                <td>$23,789</td>
                                                <td>Curaçao</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Sage Rodriguez</td>
                                                <td>$56,142</td>
                                                <td>Netherlands</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>Philip Chaney</td>
                                                <td>$38,735</td>
                                                <td>Korea, South</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>



            <!-- Footer -->
            <footer class="footer">
                @include ('layout.dashboard.footer')
            </footer>
            <!-- End Footer -->

        </div>
    <div class="fixed-plugin">
        @include ('layout.dashboard.fixed-plugin')
    </div>
        @include ('layout.dashboard.asset')



</body>
</html>
