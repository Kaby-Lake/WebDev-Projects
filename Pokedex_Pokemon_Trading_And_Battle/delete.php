<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the delete.php file. It deletes a single pokemon from the Pokedex
  if found. It can also clear the entire pokedex.
*/

  include "common.php";

  if (isset($_POST["name"])) {
    $name = $_POST["name"];
    $is_contained = contains($name);
    $name = strtolower($name);
    if($is_contained) {
      removeName($name);
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "{$_POST["name"]} not found in your Pokedex."]));
    }
  }
  else if (isset($_POST["mode"])) {
    $mode = $_POST["mode"];
    if ($mode === "removeall") {
      removeAll();
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "Unknown mode {$mode}."]));
    }
  }
  else {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-Type: application/json");
    print(json_encode(["error" => "Missing name or mode parameter."]));
  }

  /**
    This function attempts to truncate the Pokedex. If it is successful then
    a success message is printed else a 503 error is thrown.
  */
   function removeAll() {
     try {
       $db = get_PDO();
       $query = "TRUNCATE TABLE Pokedex";
       $output = $db->query($query);
       header("Content-Type: application/json");
       print(json_encode(["success" => "All Pokemon removed from your Pokedex!"]));
     } catch (PDOException $ex) {
       handleDatabaseError();
     }
   }

   /**
    @param {String} name - the name of the pokemon.
    This function removes a pokemon from the database if it is found.
    If this is successful then a success message is printed. Else a 503
    error is thrown.
   */
   function removeName($name) {
     try {
       $db = get_PDO();
       $query = "DELETE FROM Pokedex WHERE name = :name";
       $statement = $db->prepare($query);
       $params = array("name" => $name);
       $statement->execute($params);
       header("Content-Type: application/json");
       print(json_encode(["success"=>"{$_POST["name"]} removed from your Pokedex!"]));
     } catch (PDOException $ex) {
       handleDatabaseError();
     }
   }


?>
