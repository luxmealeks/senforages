<tr>
<th scope="row"><?php echo $user->id; ?></th>
<td><?php echo $user->nom; ?></td>
<td><?php echo $user->prenom; ?></td>
<td><?php echo $user->email; ?></td>
<td>
<div class="btn btn-success btn-mod-user" data-id="<?php echo $user->id; ?>"> <i class="fa fa-edit"></i></div>
</td>


<td><a href="genusers.php?action=delete&id=<?php echo $user->id; ?>" class="btn btn-primary"><i class="fa fa-trash"></i></a></td>
</tr>
