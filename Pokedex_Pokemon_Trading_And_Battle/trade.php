<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the trade.php file. It attempts to trade your pokemon for another.
  If successful then the database is updated and a success message is printed.
  Else a helpful error is thrown.
*/

  include "common.php";

  if(isset($_POST["mypokemon"])) {
    if(isset($_POST["theirpokemon"])) {
      $mypokemon = strtolower($_POST["mypokemon"]);
      $theirpokemon = strtolower($_POST["theirpokemon"]);
      trade($mypokemon, $theirpokemon);
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "Missing theirpokemon parameter."]));
    }
  }
  else {
    if(isset($_POST["theirpokemon"])) {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "Missing mypokemon parameter."]));
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "Missing mypokemon and theirpokemon parameter."]));
    }
  }

  /**
    @param {String} mypokemon - my pokemon's name
    @param {String} theirpokemon - the other pokemon's name
    This function updates the current pokemon entry in the database to the
    new one. The timestamp is updated to current.
    If there is a problem then a error is thrown and a helpful message
    is displayed.
  */
  function trade($mypokemon, $theirpokemon) {
    if (contains($mypokemon)) {
      if (contains($theirpokemon)) {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-Type: application/json");
        print(json_encode(["error" => "You have already found {$_POST["theirpokemon"]}."]));
      }
      else {
        exchange($mypokemon, $theirpokemon);
      }
    }
    else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-Type: application/json");
      print(json_encode(["error" => "{$_POST["mypokemon"]} not found in your Pokedex."]));
    }
  }

  /**
    @param {String} mypokemon - my pokemon's name
    @param {String} theirpokemon - the other pokemon's name
    This is a helper function for trade(), it executes the
    necessary query to perform the exchage of pokemons.
    If unsuccessful then a 503 error is shown.
  */
  function exchange($mypokemon, $theirpokemon) {
    $query = "UPDATE pokedex SET name = :name," .
              " nickname = :nickname, datefound = CURRENT_TIMESTAMP WHERE name = :prev;";
    try {
      $db = get_PDO();
      $statement = $db->prepare($query);
      $params = array("name" => $theirpokemon,
                      "nickname" => strtoupper($theirpokemon), "prev" => $mypokemon);
      $statement->execute($params);
      header("Content-Type: application/json");
      print(json_encode(["success"=>"You have traded your" .
                        " {$_POST["mypokemon"]} for {$_POST["theirpokemon"]}!"]));
    }
    catch (PDOException $ex) {
      handleDatabaseError();
    }
  }

?>
