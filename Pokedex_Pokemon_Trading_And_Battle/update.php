<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the update.php file. It updates the nickname of a pokemon if it
  already exists in the database. Else an error message is printed.
*/

  include "common.php";

  if(isset($_POST["name"])) {
    $name = strtolower($_POST["name"]);
    $nickname = strtoupper($name);
    if(isset($_POST["nickname"])) {
      $nickname = $_POST["nickname"];
    }
    if (contains($name)) {
      update($name, $nickname);
    }
    else {
      header("Content-Type: application/json");
      print(json_encode(["error" => "{$_POST["name"]} not found in your Pokedex."]));
    }
  }
  else {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-Type: application/json");
    print(json_encode(["error" => "Missing name parameter."]));
  }

  /**
    This fuction updates the nickname for a pokemon. If successful then a
    success message is printed else a 503 error is thrown.
  */
  function update($name, $nickname) {
    try {
      $db = get_PDO();
      $query = "UPDATE Pokedex SET nickname = :nickname WHERE name = :name;";
      $statement = $db->prepare($query);
      $params = array("nickname" => $nickname, "name" => $name);
      $statement->execute($params);
      header("Content-Type: application/json");
      print(json_encode(["success" => "Your {$_POST["name"]} is now named {$nickname}!"]));
    } catch (PDOException $ex) {
      handleDatabaseError();
    }
  }

?>
