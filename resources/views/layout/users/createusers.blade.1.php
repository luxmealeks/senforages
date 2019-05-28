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


                        <div class="content">


    <table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">N°</th>
      <th scope="col">Prénom</th>
      <th scope="col">Nom</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>

                        <!-- main-content -->
                        <div class="row justify-content-center">
                        <div class="col-lg-8 " >

                                <form method="POST" action="" name="form-create-user" id="id-form-create-user"  >
                                        <div class="form-group">
                                          <label for="input-nom">Nom</label>
                                          <input type="text" name="nom" class="form-control" id="input-nom" aria-describedby="emailHelp" placeholder="Entrer votre nom SVP">
                                          <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
                                        </div>
                                        <div class="form-group">
                                          <label for="input-prenom">Prenom</label>
                                          <input type="text" name="prenom" class="form-control" id="input-prenom" aria-describedby="emailHelp" placeholder="Entrer votre prenom SVP">
                                          <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
                                        </div>
                                        <div class="form-group">
                                          <label for="input-email">Email</label>
                                          <input type="email" name="email" class="form-control" id="input-email" placeholder="Entrer votre mot de passe SVP">
                                        </div>
                                        <!-- <div class="form-group form-check">
                                          <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                          <label class="form-check-label" for="exampleCheck1">Check me out</label>
                                        </div> -->
                                        <button type="submit" name="submit" class="btn btn-primary btn-block">Enregistrer</button>
                                      </form>
                                    </div>
                        </div>
                        <!-- End main-content -->
                    </div>
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
