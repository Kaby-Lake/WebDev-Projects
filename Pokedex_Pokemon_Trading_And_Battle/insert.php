<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the insert.php file. It inserts a pokemon into the database it one
  doesn't already exist.
  If parameters are missing or there is a database error then the appropriate
  exception is thrown along with a helpful message.
*/


  include "common.php";

  if(isset($_POST["name"])) {
    $name = $_POST["name"];
    $nickname = strtoupper($name);
    date_default_timezone_set('America/Los_Angeles');
    $time = date('y-m-d H:i:s');

    if(isset($_POST["nickname"])){
      $nickname = $_POST["nickname"];
    }

    insertPokemon($name, $nickname, $time);
  }
  else {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-Type: application/json");
    print(json_encode(["error" => "Missing name parameter."]));
  }

  /**
    @param {String} name - name of the pokemon
    @param {String} nickname of the pokemon
    @param {String} time at which the pokemon was found
    This function inserts a new pokemon into the database.
    If successful then a success message is printed else a 503 error is thrown.
  */
  function insertPokemon($name, $nickname, $time) {
    $name = strtolower($name);
    $name_in_table = contains($name);
    if ($name_in_table === False) {
      try {
        $db = get_PDO();
        $query = "INSERT INTO Pokedex VALUES(:name, :nickname, :time_stamp)";
        $statement = $db->prepare($query);
        $params = array("name" => $name, "nickname" => $nickname,
                        "time_stamp" => $time);
        $statement->execute($params);
        header("Content-Type: application/json");
        print(json_encode(["success" => "{$_POST["name"]} added to your Pokedex!"]));
      } catch (PDOException $ex) {
        handleDatabaseError();
      }

    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "{$_POST["name"]} already found."]));
    }
  }

?>
