
@include ("layout.dashboard.style")

<body class="">
    <div class="wrapper ">
        <div class="sidebar" data-color="purple" data-background-color="white" data-image="../assets/img/sidebar-1.jpg">

                <div class="logo">
                    <a href="http://www.creative-tim.com" class="simple-text logo-normal"> SENFORAGE </a>
                </div>

                    <div class="sidebar-wrapper">
                            @include ("layout.dashboard.sidebar-wrapper")
                    </div>
        </div>
            <div class="main-panel">
                        <!-- Navbar -->
                            @include ("layout.dashboard.navbar")
                        <!-- End Navbar -->

                        <!-- main-content -->


                        <div class="content">
                                  @yield('content')


                            {{-- @include ("layout.dashboard.main-content") --}}
                         </div>

                        <!-- End main-content -->

                        <!-- Footer -->
                        <footer class="footer">
                            @include ("layout.dashboard.footer") </footer>
                        <!-- End Footer -->
            </div>
    </div>
    <div class="fixed-plugin">
                        @include ("layout.dashboard.fixed-plugin")
    </div>
                        @include ("layout.dashboard.asset")
                        @include ("layout.dashboard.fixed-plugin")
</body>
</html>
