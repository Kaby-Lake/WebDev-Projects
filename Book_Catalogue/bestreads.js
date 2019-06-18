/*
  This is the .js file that provides functionality to the bestreads.html file. It requests
  information from bestreads.php and creates a library of books. Books can be searched for in
  the search bar. If a bok is clicked, information about the book is displayed.
*/

(function(){
  "use strict";
  //module globals
  const URL = 'bestreads.php';
  const BOOKS = URL + '?mode=books';
  const FETCH_PARAMS_GET = {
    method: 'GET',
    mode: 'cors'
  };
  let BACK = {};

  window.addEventListener('load', init);

  /**
    This function is called when the page loads. It creates an event listener for the home
    and search buttons.
  */
  function init() {
    displayAllBooks();
    let homeButton = document.getElementById('home');
    homeButton.addEventListener('click', displayAllBooks);
    let searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', displaySomeBooks);
  }

  /**
    This function poplates the book list with all books that match the search query.
    It also enables the back button.
  */
  function displaySomeBooks() {
    let homeButton = document.getElementById('home');
    homeButton.disabled = false;
    let searchBar = document.getElementById('search-term');
    let searchTerm = searchBar.value.trim();
    fetch(BOOKS + '&search=' + searchTerm, FETCH_PARAMS_GET)
      .then(checkStatus)
      .then(JSON.parse)
      .then(populateBoard)
      .catch(console.error);
    let board = document.getElementById('book-list');
    board.classList.remove('hidden');
    let singleBook = document.getElementById('single-book');
    singleBook.classList.add('hidden');
  }

  /**
    This function poplates the book list with all books stored in the server.
  */
  function displayAllBooks() {
    let homeButton = document.getElementById('home');
    homeButton.disabled = true;
    let searchBar = document.getElementById('search-term');
    searchBar.value = '';
    let backButton = document.getElementById('back');
    backButton.classList.add('hidden');
    let board = document.getElementById('book-list');
    board.classList.remove('hidden');
    let singleBook = document.getElementById('single-book');
    singleBook.classList.add('hidden');
    fetch(BOOKS, FETCH_PARAMS_GET)
      .then(checkStatus)
      .then(JSON.parse)
      .then(populateBoard)
      .catch(console.error);
  }

  /**
    @param {object} data - the list of books to add
    This helper function takes the data about books obtained from the server and adds
    the books to the display area for all books. It then adds an event listener for
    eack book.
  */
  function populateBoard(data) {
    let error = document.getElementById('error-text');
    error.innerText = '';
    error.classList.add('hidden');
    let books = data['books'];
    let board = document.getElementById('book-list');
    let bookContainers = board.children;
    for (let i = 0; i < bookContainers.length; i++) {
        bookContainers[i].removeEventListener('click', singleBookView);
    }
    board.innerHTML = '';
    for (let i = 0; i < books.length; i++) {
      let book = books[i];
      let bookContainer = document.createElement('div');
      let cover = document.createElement('img');
      let searchTitle = document.createElement('p');
      searchTitle.appendChild(document.createTextNode(book['folder']));
      searchTitle.classList.add('hidden');
      cover.src = 'books/' + book['folder'] + '/cover.jpg';
      cover.alt =  book['title'];
      let title = document.createElement('p');
      title.appendChild(document.createTextNode(book['title']));
      bookContainer.append(title);
      bookContainer.append(cover);
      bookContainer.append(searchTitle);
      bookContainer.classList.add('selectable');
      board.appendChild(bookContainer);
      bookContainer.addEventListener('click', singleBookView);
    }
    if (board.children.length === 0) {
      let searchBar = document.getElementById('search-term');
      searchMessageView(searchBar.value);
    }
  }

  /**
    This function is called when a book is clicked. It hides the book list and displays information
    about the particular book by querying multiple requests to the server through helper
    functions.
  */
  function singleBookView() {
    let title = this.children[2].innerText;
    let backButton = document.getElementById('back');
    backButton.classList.remove('hidden');
    let bookList = document.getElementById('book-list');
    bookList.classList.add('hidden');
    let singleBook = document.getElementById('single-book');
    singleBook.classList.remove('hidden');
    let cover = document.getElementById('book-cover');
    cover.src = 'books/' + title + '/cover.jpg';
    fetch(URL + '?mode=info&title=' + title)
      .then(checkStatus)
      .then(JSON.parse)
      .then(showTitle)
      .catch(console.error);
    fetch(URL + '?mode=description&title=' + title)
      .then(checkStatus)
      .then(showDescription)
      .catch(console.error);
    fetch(URL + '?mode=reviews&title=' + title)
      .then(checkStatus)
      .then(JSON.parse)
      .then(showReviews)
      .catch(console.error);
    enableBack();
  }

  /**
    This function enables the back button and provides functionality to it when a book is
    clicked. The event listener added to the back button hides the single book view and shows
    the book list view. Previous event listeners on the back button are removed.
  */
  function enableBack() {
    let backButton = document.getElementById('back');
    BACK = function(){
            let error = document.getElementById('error-text');
            error.classList.add('hidden');
            let singleBook = document.getElementById('single-book');
            singleBook.classList.add('hidden');
            let board = document.getElementById('book-list');
            board.classList.remove('hidden');
            backButton.classList.add('hidden');
          };
    backButton.addEventListener('click', BACK);
  }

  /**
    @param {object} data - title and author of the book
    This function adds information about the title and the author to the webpage.
  */
  function showTitle(data) {
    let title = document.getElementById('book-title');
    title.innerText = data['title'];
    let author = document.getElementById('book-author');
    author.innerText = data['author'];
    let cover = document.getElementById('book-cover');
    cover.alt = title;
  }

  /**
    @param {object} data - description of the book
    This function adds the description of the book to the webpage.
  */
  function showDescription(data) {
    let description = document.getElementById('book-description');
    description.innerText = data;
  }

  /**
    @param {object} data - reviews of the book
    This function adds each review of the book to the webpage and also the avg rating.
  */
  function showReviews(data) {
    let avgReview = 0;
    let totalReviews = data.length;
    let reviewContainer = document.getElementById('book-reviews');
    for (let i = 0; i < totalReviews; i++) {
      let review = data[i];
      avgReview += parseInt(review['rating']);
      let name = document.createElement('h3');
      name.innerText = review['name'];
      let rating = document.createElement('h4');
      rating.innerText = 'Rating: ' + parseInt(review['rating']).toFixed(1);
      let comment = document.createElement('p');
      comment.innerText = review['text'];
      reviewContainer.appendChild(name);
      reviewContainer.appendChild(rating);
      reviewContainer.appendChild(comment);
    }
    avgReview = (avgReview/totalReviews).toFixed(1);
    let overallRating = document.getElementById('book-rating');
    overallRating.innerText = avgReview;
  }

  /**
    This function displays an error message if an incorrect request is made to the server.
    The book list view and single book view are disabled and the home button is enabled.
  */
  function errorMessageView() {
    let error = document.getElementById('error-text');
    error.innerText = 'Something went wrong with the request. Please try again later.';
    error.classList.remove('hidden');
    let board = document.getElementById('book-list');
    board.classList.add('hidden');
    let singleBook = document.getElementById('single-book');
    singleBook.classList.add('hidden');
    let homeButton = document.getElementById('home');
    homeButton.disabled = false;
    let backButton = document.getElementById('back');
    backButton.classList.add('hidden');
  }

  /**
    @param {string} query - the search term entered
    This function displays an error if no book matches turn up for the search request made.
    The book list view and single book view are disabled and the home button is enabled.
  */
  function searchMessageView(query) {
    let error = document.getElementById('error-text');
    error.innerText = 'No books found that match the search string ' + query +
                      ', please try again.';
    error.classList.remove('hidden');
    let board = document.getElementById('book-list');
    board.classList.add('hidden');
    let singleBook = document.getElementById('single-book');
    singleBook.classList.add('hidden');
    let homeButton = document.getElementById('home');
    homeButton.disabled = false;
    let backButton = document.getElementById('back');
    backButton.classList.add('hidden');
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      errorMessageView();
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
