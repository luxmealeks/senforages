@include('layout.dashboard.style')
@include ('layout.dashboard.navbar')
@include('layout.dashboard.sidebar')
@extends('layouts.app')

@yield('navmenuSM')
  @yield('navbare')
 <div class="wrapper ">
            <div class="main-panel">
                <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Gestion des compteurs</h1>
    <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
  </div>
</div>
                <div class="content">
<body>

    <div class="container-fluid">

<form>
    <div class="form-group">
        <label for="input-prenom">N° Compteur </label>
        <input type="text" name="prenom" class="form-control" id="input-prenom" aria-describedby="emailHelp" placeholder="Entrer le nom du  SVP">
    </div>
    <button type="submit" class="btn btn-primary">Enregistrer</button>
</form>

</body>
                </div>
  </div>
    </div>
      </div>