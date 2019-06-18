<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the getcreds.php file. It prints the player id and token in text format.
*/

  /**
    This function prints the player id and token value in text format.
  */
  function getCreds() {
    $PID = "zzs5123";
    $token = "poketoken_5cf4654b44d365.80898905";

    header("Content-Type: text/plain");
    print($PID . "\n");
    print($token);
  }

  getCreds();

?>
