<!DOCTYPE html>
<html lang="en">

<head>
 <?php
include 'style.blade.php';

?>
</head>

<body class="">
  <div class="wrapper ">
    <div class="sidebar" data-color="purple" data-background-color="white" data-image="../assets/img/sidebar-1.jpg">
      <!--
        Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"

        Tip 2: you can also add an image using data-image tag
    -->
      <div class="logo">
        <a href="http://www.creative-tim.com" class="simple-text logo-normal">
          SENFORAGE
        </a>
      </div>
      <?php
          include 'sidebar-wrapper.blade.php';
          ?>
    </div>
    <div class="main-panel">
      <!-- Navbar -->
      <?php
          include 'navbar.blade.php';
          ?>
      <!-- End Navbar -->
      <?php
          include 'main-content.blade.php';
          ?>
      <?php
          include 'footer.blade.php';
          ?>
    </div>
  </div>
  <?php
          include 'fixed-plugin.blade.php';
          ?>
  <!--   Core JS Files   -->
 <?php
          include 'script.blade.php';
  ?>
</body>

</html>
