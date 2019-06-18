<?php
  /*
    This is the .php file that acts as a local server for bestreads.js. It creates appropriate
    responses for different api end points. It contains information about all books.
  */

  if (isset($_GET['mode'])) {
    $mode = $_GET['mode'];
    if ($mode === 'books') {
      addBooks();
    }
    elseif($mode === 'description') {
      if (isset($_GET['title'])) {
        $title = $_GET['title'];
        addDescription($title);
      }
      else {
        print_para_missing($mode);
      }
    }
    elseif($mode === 'info') {
      if (isset($_GET['title'])) {
        $title = $_GET['title'];
        addInfo($title);
      }
      else {
        print_para_missing($mode);
      }
    }
    elseif($mode === 'reviews') {
      if (isset($_GET['title'])) {
        $title = $_GET['title'];
        addReviews($title);
      }
      else {
        print_para_missing($mode);
      }
    }
    else {
      header('HTTP/1.1 400 Invalid Request');
      print 'Please provide a mode of description, info, reviews, or books.';
    }
  }
  else {
    header('HTTP/1.1 400 Invalid Request');
    print 'Please provide a mode of description, info, reviews, or books.';
  }

  /**
    @param {string} mode - the mode of the api end point
    This is an error function which is called if title parameter is not passed along
    with the approriate mode.
  */
  function print_para_missing($mode) {
    header('HTTP/1.1 400 Invalid Request');
    print 'Please remember to add the title parameter when using mode=' . $mode . '.';
  }

  /**
    This function accesses the info.txt file for each book and extracts the title and folder
    for the book. This is then added to an array.
    Prints an array of books containing the title and folder for each book in JSON format.
  */
  function addBooks() {
    $titles = array();
    $titles['books'] = array();
    $book_folders = scandir('books/');
    $book_folders = array_slice($book_folders, 2);

    foreach ($book_folders as $book) {
      $file = file('books/' . $book . '/info.txt');
      $can_Add = True;
      if (isset($_GET['search'])) {
        $search = $_GET['search'];
        $can_Add = contains($file[0], $search);
      }

      $to_add = array('title' => trim($file[0]), 'folder' => $book);
      if ($can_Add) {
        array_push($titles['books'], $to_add);
      }
    }
    header("Content-Type: application/json");
    print json_encode($titles);
  }

  /**
    @param {string} title - the title of the book
    @param{string} search - the search term passed by the user
    This function checks if the search term is a substring of the title.
    @returns {boolean} - returns True/False depending on whether the search term is in the title.
  */
  function contains($title, $search) {
    $result = strpos(strtolower($title), '' . $search);
    return  $result !== False;
  }

  /**
    @param {string} title - the title of the book
    Accesses the description.txt file for the book and stores the content in an array.
    If the book is not present then throws an error.
    Prints the description of the book as a string.
  */
  function addDescription($title) {
    $book_folders = scandir('books/');
    $book_folders = array_slice($book_folders, 2);
    if(!in_array($title, $book_folders)) {
      header('HTTP/1.1 400 Invalid Request');
      print('No description for ' . $title . ' was found.');
    }
    else {
      $file = file('books/' . $title . '/description.txt');
      header("Content-Type: text/plain");
      print($file[0]);
    }
  }

  /**
    @param {string} title - the title of the book
    Accesses the info.txt file for the book and stores the contents in an array.
    If the book is not present then throws an error.
    Prints an array containng the title and author of the book in JSON format.
  */
  function addInfo($title) {
    $book_folders = scandir('books/');
    $book_folders = array_slice($book_folders, 2);
    if(!in_array($title, $book_folders)) {
      header('HTTP/1.1 400 Invalid Request');
      print('No info for ' . $title . ' was found.');
    }
    else {
      $file = file('books/' . $title . '/info.txt');
      $title = trim($file[0]);
      $author = trim($file[1]);
      header("Content-Type: application/json");
      print json_encode(array('title' => $title, 'author' => $author));
    }
  }

  /**
    @param {string} title - the title of the book
    Accesses the reviews.txt file for the book and stores the contents in an array.
    If the book is not present then throws an error.
    Prints an array containng the reviews for the book in JSON format.
  */
  function addReviews($title) {
    $book_folders = scandir('books/');
    $book_folders = array_slice($book_folders, 2);
    if(!in_array($title, $book_folders)) {
      header('HTTP/1.1 400 Invalid Request');
      print('No info for ' . $title . ' was found.');
    }
    else {
      $ratings = array();
      $files = scandir('books/' . $title);
      $end = count($files);
      for ($i = 5; $i < $end; $i += 1) {
        $file = file('books/' . $title . '/'. $files[$i]);
        $to_add = array('name' => trim($file[0]), 'rating' => trim($file[1]),
                        'text' => trim($file[2]));
        array_push($ratings, $to_add);
      }
      header("Content-Type: application/json");
      print json_encode($ratings);
    }
  }

?>
