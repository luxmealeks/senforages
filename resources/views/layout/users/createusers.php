<?php
require_once 'User.php';
require_once 'SnNameGenerator.php';
?>

<?php // pour enregistrer un nouvel utilisateur.

if (isset($_POST['submit'])) {
    $prenom = htmlentities($_POST['prenom']);
    $nom = htmlentities($_POST['nom']);
    $email = htmlentities($_POST['email']);
    $user = new User($prenom, $nom, $email);
    $user->save();
    header['Location:genusers.php'];
}
?>
    <!-- <script type="text/javascript"> alert("xss"); 
        window.location.url ="#"
    </script> -->





<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>SenForage</title>
  </head>
  <body>
  <?php include 'header.php'; ?>

  <div class="container-fluid">
  <div class="row justify-content-center">
<div class="col-6">
<form method="POST" action="" name="form-create-user" id="id-form-create-user">
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
  <div class="row">

  </div>
  </div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  

  </body>

</html>
