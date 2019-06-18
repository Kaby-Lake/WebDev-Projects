<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the select.php file. It prints all rows of the database in json format.
*/

  include "common.php";

  try {
    $db = get_PDO();
    $query = "SELECT * FROM Pokedex;";
    $output = $db->query($query);
    $to_print = ["pokemon" => $output->fetchALL(PDO::FETCH_ASSOC)];
    header("Content-Type: application/json");
    print(json_encode($to_print));
  } catch (PDOException $ex) {
    handleDatabaseError();
  }
?>
