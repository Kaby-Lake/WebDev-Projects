<?php
/*
  Author: Zoheb Siddiqui
  Date created: 06/02/2019

  This is the common.php file. It contains all common code that is used by other
  .php files.
*/

  /**
    This function initialises a PDO object to connect to an SQL database.
    If the connection is made then the PDO object is returned else a 503
    error is thrown.
    @returns {PDO Object}
  */
  function get_PDO() {
    # Variables for connections to the database.
    $host = "localhost";     # fill in with server name (e.g. localhost)
    $port = "3306";      # fill in with a port if necessary (will be different mac/pc)
    $user = "root";     # fill in with user name
    $password = "root"; # fill in with password (will be different mac/pc)
    $dbname = "hw5db";   # fill in with db name containing your SQL tables

    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $db;
    } catch (PDOException $ex) {
      handleDatabaseError();
    }
  }

  /**
    @param {String} name - the name of a pokemon.
    This method checks if a pokemon exists in the database.
    If there is an problem connecting to the database then a 503 error is trown.
    @returns {boolean}
  */
  function contains($name) {
    $name_in_table = False;
    try{
      $db = get_PDO();
      $query = "SELECT * FROM Pokedex WHERE name = :name;";
      $statement = $db->prepare($query);
      $params = array("name" => $name);
      $statement->execute($params);
      $output = $statement->fetchALL(PDO::FETCH_ASSOC);
      if (sizeof($output) !== 0) {
        $name_in_table = True;
      }
    } catch (PDOException $ex) {
      handleDatabaseError();
    }
    return $name_in_table;
  }

  /**
    This function throws a 503 error when called. It also displays an error message.
    This function is called when there is a problem while connecting to the database.
  */
  function handleDatabaseError() {
    header("HTTP/1.1 503 Service Unavailable");
    header("Content-Type: application/json");
    print(json_encode(["error" => "A database error occurred. Please try again later."]));
  }

?>
