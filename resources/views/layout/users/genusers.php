
<?php
require_once 'User.php';
require_once 'SnNameGenerator.php';
    $status = false;
        if (isset($_POST['submit'])) {
            $nombre = (int) $_POST['nombre'];
            for ($i = 0; $i < $nombre; ++$i) {
                $nom = SnNameGenerator::getName();
                $prenom = SnNameGenerator::getFirstName();
                $email = $nom.'@'.$prenom.'.com';
                $user = new User($nom, $prenom, $email);
                $user->save();
                $status = true;
            }
        }
$users = User::get();
?>

<!doctype html>
<html lang="en">
<head>
  <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
    <!-- pour l'ajout des boutons font-awesome -->
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css" />
      
  <title>SenForage</title>
</head>

<body>
  <?php include 'header.php'; ?>

  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-6">
        <form method="POST" action="" name="form-gen-user" id="id-form-gen-user">
          <div class="form-group">
            <label for="input-nom">Nom</label>
            <input type="number" name="nombre" class="form-control" id="input-nonombre-users"
              aria-describedby="emailHelp" placeholder="Entrer le nombre d'utilisateurs svp">
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <button type="submit" name="submit" class="btn btn-primary btn-block">Generer</button>
          
        </form>
      </div>
    </div>
    <div class="row mt-5">

    </div>
           <div class="row justify-content-center">
                 <div class="col-12">
                  <table class="table" id="tableusers">
                              <thead class="thead-dark">
                                  <tr>
                                      <th scope="col">id</th>
                                        <th scope="col">Nom</th>
                                          <th scope="col">Prenom</th>
                                          <th scope="col">Email</th>
                                          <th scope="col">Modifier</th>
                                      <th scope="col">Supprimer</th>
                                    </tr>
                                </thead>
                          <tbody>
                            <?php foreach ($users as $user) {
    include 'user_row.php';
}?>
                          </tbody>
                    </table>
               </div>
     </div>
      
          <!--    <div class="row mt-5 mb-5">
           Button trigger modal   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal_message">  Supprimer </button>-->
                       </div>
  </div>
 
  <?php
//pour supprimer un utilisateur
//$action = $_GET['action'];
 // if(isset($action) && $action =="delete")
 // {
 //     $id =$_GET['id'];
  //    $user = User::find($id);
   //   $user->delete();
  //    $status=true; // verifie l'etat de suppression

 // }
//$users=User::get();
?>

<?php  $status = false;
        if ($_GET['action'] == 'delete') {
            $id = $_GET['id'];
            $user = User::find($id);
            $user->delete();
            $status = true;
        }?> 

<!-- Modal -->
<div class="modal fade" id="modal_message" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalCenterTitle">Confirmation</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                          </div>
                              <div class="modal-body">
                                Utilisateur supprimé avec succés!
                              </div>
                          <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                      <!-- <button type="button" class="btn btn-primary">Enregistrer les modifications</button> -->
              </div>
            </div>
  </div>
</div>


<br><br>
<footer>
  <nav class="navbar fixed-bottom navbar-light bg-light">
  <a class="navbar-brand" href="#">Fixed top</a>
</nav>
  </footer>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"  integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"></script> -->

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
    
            <script 
                  type="text/javascript">
                  console.log("message");
                  $(document).ready(function(){
                      console.log("ready!");
                        <?php if ($status) {
            ?>
                        $("#modal_message").modal("show");
                            <?php
        } $status = false; ?>
                          //script ajouté, pour initialiser la librairie de la table. le selecteur sera position avec l'id de la table user ici tableusers. le # permet de selectionner un element avec son id
                          $("#tableusers").DataTable();
                  });
                  //bouton font-awesom
                 $(".btn-mod-user").click(function () {
              console.log($(this).data("id"));
          });</script> 
<!-- deuxieme script pour le bouton EDITER-->
            <script 
                  type="text/javascript">
                        console.log("Mon message JS");
                      $(document).ready(function(){
                        console.log("OK Ready!");
                        <?php if ($status) {
            ?>
                          $("#modal_message").modal("show");
                          <?php
        } $status = false; ?>
               /* script ajouté, pour initialiser la librairie de la table. le selecteur sera positionné 
           avec l'id de la table user ici tableusers. 
           le # permet de selectionner un element avec son id   */
                      $("#tableusers").DataTable();
                      $(".btn-mod-user").click(function () { 
                        var id=$(this).data("id");
                        console.log($(this).data("id"));
                        var request = $.ajax({
                          type: "POST",
                          url: "UserController.php",
                          data: {"user":id},
                          dataType: "json"

                         
            });
            //lorsque la requete est terminée, on verifie ce qu'elle renvoie
            request.done(function (msg) {
              //tester l'entrée du nom
                      $('#id-identifiant-user').val(msg.id);
                      $('#input-edit-nom').val(msg.nom);
                      $('#input-edit-prenom').val(msg.prenom);
                      $('#input-edit-email').val(msg.email);
              //afficher le modal editer
                      $("#modal-edit-user").modal("show");
              });
          });
          //ce bout de code permet d'envoyer les données vers le serveur. C'est en AJAX
                    $("#btn-update").click(function() {
                      var donnees=$("#form-edit-user").serializeArray();
                      console.log(donnees);
                      var request = $.ajax({
                          type: "POST",
                          url: "UserController.php",
                          data: donnees,//afficher les données du tableau
                          dataType: "json"
                      });
                      request.done(function (msg) {});                      
                    })
                });

</script>
<!-- Button trigger modal -->
<!-- Modal -->
<div class="modal fade" id="modal-edit-user" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
                <div class="modal-dialog" role="document">
                     <div class="modal-content">
                            <div class="modal-header">
                                 <h5 class="modal-title">Modification utilisateur</h5>
                                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                       </button>
                                        </div>
                                            <div class="modal-body">
                                                <form id="form-edit-user">
                                                <input type ="hidden" name="action" value = "update">
                                                   <!--association clé valeur sur la ligne -->
                                                <input type ="hidden" name="id" id = "id-identifiant-user">
                                               <div class="form-group">
                                             <label for="input-edit-nom">Nom</label>
                                             <input type="text" name="nom" class="form-control" id="input-edit-nom" aria-describedby="emailHelp" placeholder="Entrer votre nom SVP">
                   
                    <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
                                        </div>
                                        <div class="form-group">
                                      <label for="input-edit-prenom">Prenom</label>
                                  <input type="text" name="prenom" class="form-control" id="input-edit-prenom" aria-describedby="emailHelp" placeholder="Entrer votre prenom SVP">
                                 <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
                                    </div>
                                      <div class="form-group">
                                      <label for="input-edit-email">Email</label>
                                    <input type="email" name="email" class="form-control" id="input-edit-email" placeholder="Entrer votre mot de passe SVP">
                                </div>
                                <!-- <div class="form-group form-check">
                               <input type="checkbox" class="form-check-input" id="exampleCheck1">
                              <label class="form-check-label" for="exampleCheck1">Check me out</label>
                            </div> -->
                       <div  id="btn-update" class="btn btn-warning btn-block">Enregistrer </div
                    </form>
                   </div>
                <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary">Save</button>
    </div>
    </div>
  </div>
</div>

</body>
</html>