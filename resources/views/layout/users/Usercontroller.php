<?php

require_once 'User.php';

if (isset($_POST['user'])) {
    $id = $_POST['user'];
    $user = User::find($id);
    echo json_encode($user);
}

if (isset($_POST['action'])) {
    $id = $_POST['id'];
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];

    $user = User::find($id);
    $user->nom = $nom;
    $user->prenom = $prenom;
    $user->email = $email;
    $user->save();
    echo json_encode('Enregistrement effectué');
}
