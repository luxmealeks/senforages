@include ('layout.dashboard.style')

<body class="content">
    <div class="wrapper ">
        <div class="sidebar" data-color="green" data-background-color="white" data-image="public/assets/img/sidebar-1.jpg">
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
                                    <h4 class="card-title">Ajouter village</h4>
                                    <p class="card-category">
                                        <p class="card-category">Details</p>
                                        <p class="card-category">Demande client</p>
                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> updated 4 minutes ago
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
                                        <h4 class="card-title">Stats villages</h4>
                                        <p class="card-category">Nombre de villages : </p>
                                        <p class="card-category">Details : </p>


                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> campaign sent 2 days ago
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
                                        <h4 class="card-title">Chefs de village</h4>
                                        <p class="card-category">Details</p>
                                        <p class="card-category">Nombre </p>

                                    </div>
                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="material-icons">access_time</i> campaign sent 2 days ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        @yield('content')
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
