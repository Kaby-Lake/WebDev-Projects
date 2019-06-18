/*
  Author: Zoheb Siddiqui
  Created: 04/20/2019

  This it the .js file that provides functionality to the html code.
  This .js file is called by set.html.
  The .js file is responsible for switching between the main view and game view.
  When in game view, this file provides functionality which lets us play the game.
*/
(function() {
  "use strict";

  //declaring module global variables
  const STYLES = ['outline', 'solid', 'striped'];
  const SHAPES = ['diamond', 'oval', 'squiggle'];
  const COLORS = ['green', 'purple', 'red'];
  const MAXIMAGES = 3;
  let SELECTED = 0;
  let TIMER = null;
  let TIME = 0;

  window.addEventListener('load', init);

  /**
    This function creates 3 event listners.
    One to start the game, one to refresh the board and one to
    go back to main.
  */
  function init() {
    let start = document.getElementById('start');
    start.addEventListener('click', initialiseGame);

    let refresh = document.getElementById('refresh');
    refresh.addEventListener('click', refreshGame);

    let back = document.getElementById('main-btn');
    back.addEventListener('click', backToMain);
  }

  /**
    This is a helper function for generateImage().
    it queries the difficulty set by the user for the game.
    This difficulty value is then returned.
    @return {string} difficulty - returns the value od the difficulty for the game.
  */
  function setDifficulty() {
    let difficulties = document.querySelector('#menu-view p').children;
    let difficulty = '';
    for (let i = 0; i < difficulties.length; i++) {
      if (difficulties[i].firstChild.checked) {
        difficulty = difficulties[i].firstChild.value;
      }
    }
    return difficulty;
  }

  /**
    This is a helper function for createCard().
    It figures out the difficulty selected by the user, generates random indices for
    card elements and returns the name of the image file too use along with the number
    of times this image will be added
    @return {object} a - contains the file name of the image to generate and the number
                         of times to generate this image.
  */
  function generateImage() {
    let difficulty = setDifficulty();
    let styleIndex = Math.floor(Math.random()*STYLES.length);
    if (difficulty === 'easy') {
      styleIndex = 1;
    }
    let shapeIndex = Math.floor(Math.random()*SHAPES.length);
    let colorIndex = Math.floor(Math.random()*COLORS.length);
    let count = Math.floor(Math.random()*MAXIMAGES) + 1;
    let image = STYLES[styleIndex] + '-' + SHAPES[shapeIndex] + '-' + COLORS[colorIndex];
    return [image, count];
  }

  /**
    @param {object} board - the current game board.
    @param {string} image - the name of the image file to use.
    @param {int} count - the number of times to generate the image.
    This is a helper function for populateBoard() and replaceCard().
    It takes the current board, an image file name and a count as input.
    It creates a new card element and populates it with the specified image count
    number of times.
    @return {object} card - the div element card which contains images.
  */
  function createCard(board, image, count) {
    let card = document.createElement('div');
    for (let i = 0; i < count; i++) {
      let imageToAdd = document.createElement('img');
      imageToAdd.src = 'img/' + image + '.png';
      imageToAdd.alt = image;
      card.appendChild(imageToAdd);
      card.classList.add('card');
    }
    return card;
  }

  /**
    @param {string} difficulty - contains the difficulty chosen for the use for the game.
    This function populates the game board with cards. The number of cards depends on the
    difficulty. Cards are added to the board if they do not share all 4 attributes with another
    card already on the board.
  */
  function populateBoard(difficulty) {
    let board = document.getElementById('game');
    let card = null;
    let cards = [];
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
    let cardIds = [];
    let noOfCards = 12;
    if (difficulty === 'easy') {
      noOfCards = 9;
    }
    while (cardIds.length !== noOfCards) {
      let imageCount = generateImage();
      let image = imageCount[0];
      let count = imageCount[1];
      if (!(cardIds.includes(image + '-' + count))) {
        cardIds.push(image + '-' + count);
        card = createCard(board, image, count);
        board.appendChild(card);
        cards.push(card);
      }
    }
    playGame(board, cards);
  }

  /**
  @param {object} card - the div element card which contains images.
  This is a helper function for selectEvent()
  This function takes a card and toggles 'selected' in its class list.
  If it is added to the class list then the number of selected cards is incremented by 1
  else it is decremented by 1.
  */
  function select(card) {
    card.classList.toggle('selected');
    if (card.classList.contains('selected')) {
      SELECTED += 1;
    }
    else {
      SELECTED -= 1;
    }
  }

  /**
    This is a helper function for playGame().
    If 3 cards are selected then this function calls act().
  */
  function selectEvent() {
    select(this);
    if (SELECTED === 3) {
      SELECTED = 0;
      act();
    }
  }

  /**
    @param {object} board - the game board.
    @param {object} cards - an array of all the cards on the game board.
    This function creates event listners for each card.
  */
  function playGame(board, cards) {
    let allCards = board.children;
    cards = Object.values(cards);
    for (let i = 0; i < allCards.length; i++) {
      let card = cards[i];
      if (cards.includes(card)) {
        card.addEventListener('click', selectEvent);
      }
    }
  }

  /**
    @param {object} selectedCards - an array of cards that have been selected.
    @param {object} descriptions - an array storing the descriptions of the selected cards.
    @param {object} cards - an array containing all the cards on the board.
    This function is a helper function for act().
    It finds the selected cards and stores their information.
  */
  function findSelected(selectedCards, descriptions, cards) {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains('selected')) {
        descriptions.push(cards[i].firstChild.alt + '-' + cards[i].children.length);
        selectedCards.push(cards[i]);
      }
    }
  }

  /**
    @param {object} cards - an array of all cards in the game board.
    This function is a helper function for act().
    This function finds the selected cards and replaces them with new cards.
    The replacement is done in such a way that no replacement has all 4 attributes in common
    with the pre existing cards on the board.
    Finaly the playGame() function is called to assign event listners to the replacement cards.
  */
  function replaceCards(cards) {
    let replaced = [];
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains('selected')) {
          let board = document.getElementById('game');
          let imageCount = generateImage();
          let image = imageCount[0];
          let count = imageCount[1];
          let newCard = createCard(board, image, count);
          while (cards.includes(newCard)) {
            imageCount = generateImage();
            image = imageCount[0];
            count = imageCount[1];
            newCard = createCard(board, image, count);
          }
          replaced.push(newCard);
          cards[i].classList.remove('selected');
          board.replaceChild(newCard, cards[i]);
          cards[i] = newCard;
      }
    }
    playGame(document.getElementById('game'), replaced);
  }

  /**
    This funcion is a helper for act().
    It checks the value for the timer selected by the user. It assigns a penalty to time when
    called absed on the timer value.
  */
  function penalty() {
    let timer = document.querySelector('#menu-view select');
    timer = timer.value;
    if (timer === 'none') {
      TIME += 15;
    }
    else {
      TIME -= 15;
      if (TIME < 0) {
        TIME = 0;
      }
    }
  }

  /**
    @param {string} text - the text to display.
    @param {object} card - the card to display the text in.
    This is a helper function for act().
    It hides all images in the card and displayes the text for one second.
    Then the text is removed and the images are added back.
  */
  function displayText(text, card) {
    for (let i = 0; i < card.children.length; i++) {
      card.children[i].classList.add('hidden');
    }
    let para = document.createElement('p');
    para.innerText = text;
    card.appendChild(para);
    setTimeout(function(){
      card.removeChild(para);
      for (let i = 0; i < card.children.length; i++) {
        card.children[i].classList.remove('hidden');
      }
    },1000);
  }

  /**
    @param {object} descriptions - an array containing the descriptions of all selected cards.
    This is a helper function for act().
    It checks the attributes of all selected cards to see if the selected cards form a set of not.
    It returns a boolean avccordingly.
    @return {boolean} toReturn.
  */
  function checkSet(descriptions) {
    let attributes1 = descriptions[0].split('-');
    let attributes2 = descriptions[1].split('-');
    let attributes3 = descriptions[2].split('-');
    let toReturn = true;
    for (let i = 0; i < attributes1.length; i++) {
      if (!((attributes1[i] === attributes2[i] && attributes1[i] === attributes3[i]
          ) ||
          (attributes1[i] !== attributes2[i] && attributes1[i] !== attributes3[i] &&
            attributes2[i] !== attributes3[i]
          )
      )) {
        toReturn = false;
      }
    }
    return toReturn;
  }

  /**
    This function is a helper function for playGame().
    It gets all cards, all selected cards. Then it checks if the selected cards form a set.
    If the do then the appropriate message is displayed, set count is incremented by 1
    and replaceCards() is called.
    Else the appropriate message is displayed and a penalty to time is applied.
  */
  function act() {
    let cards = document.getElementById('game').children;
    cards = Object.values(cards);
    let selectedCards = [];
    let descriptions = [];
    findSelected(selectedCards, descriptions, cards);
    let isSet = checkSet(descriptions);
    if (isSet) {
      let text = 'SET!';
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('selected')) {
          displayText(text, cards[i]);
        }
      }
      setTimeout(function(){
        let counter = document.getElementById('set-count');
        counter.innerText = parseInt(counter.innerText) + 1 + '';
        replaceCards(cards);
      },1000);
    }
    else {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('selected')) {
          let text = 'Not a Set :(';
          cards[i].classList.remove('selected');
          displayText(text, cards[i]);
        }
      }
      penalty();
    }
  }

  /**
    @param {object} timeDisplay - the dom element that displays time.
    This function starts a count down if the user does not select unlimited time.
    If the time reaches 0 then the time interval is cleared and endGame() is called.
  */
  function startCountDown(timeDisplay) {
    TIMER = setInterval(function() {
      if (TIME === 0) {
        timeDisplay.innerText = convert();
        clearInterval(TIMER);
        endGame();
      }
      else {
        TIME -= 1;
        timeDisplay.innerText = convert();
      }
    }, 1000);
  }

  /**
    This function resets the number of selected elements to 0.
    The refresh button is disabled. All seleted cards are unselected.
    The cards are also made unclickable.
  */
  function endGame() {
    SELECTED = 0;
    let refresh = document.getElementById('refresh');
    refresh.removeEventListener('click', refreshGame);
    let board = document.getElementById('game');
    let cards = board.children;
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove('selected');
      cards[i].removeEventListener('click', selectEvent);
    }
  }

  /**
    @param {object} timeDisplay - the dom element that displays time.
    This function starts a count up if the user selects unlimited time.
  */
  function startCountUp(timeDisplay) {
    TIMER = setInterval(function() {
      TIME += 1;
      timeDisplay.innerText = convert();
    }, 1000);
  }

  /**
    This function converts time in seconds to the appropriate display format.
    @return {string} toReturn - returns the appropriate string to display
  */
  function convert() {
    const secsPerMinute = 60;
    let minutes = parseInt(TIME/secsPerMinute);
    let seconds = TIME - minutes*secsPerMinute;
    let toReturn = '';
    if (minutes >= 10) {
      toReturn += minutes;
    }
    else {
      toReturn += '0' + minutes;
    }
    if (seconds >= 10) {
      toReturn += ':' + seconds;
    }
    else {
      toReturn += ':0' + seconds;
    }
    return toReturn;
  }

  /**
    This function resets the count for the number of sets.
  */
  function setCountZero() {
    let count = document.getElementById('set-count');
    count.innerText = '0';
  }

  /**
    This function calls startCountUp() or startCountDown() based on the timer selection
    made by the user when starting the game.
  */
  function setTimer() {
    let timer = document.querySelector('#menu-view select');
    TIME = timer.value;
    let timeDisplay = document.getElementById('time');
    if (TIME === 'none') {
      TIME = 0;
      startCountUp(timeDisplay);
    }
    else {
      TIME = parseInt(TIME);
      startCountDown(timeDisplay);
    }
  }

  /**
    This function hides the main page and displays the game page.
  */
  function gameView() {
    let mainView = document.getElementById('menu-view');
    mainView.classList.add('hidden');
    let gameView = document.getElementById('game-view');
    gameView.classList.remove('hidden');
  }

  /**
    This function hides the game page and displays the main page.
  */
  function mainView() {
    let mainView = document.getElementById('menu-view');
    mainView.classList.remove('hidden');
    let gameView = document.getElementById('game-view');
    gameView.classList.add('hidden');
  }

  /**
    This function resets all game values. It resets the set counter and the timer.
    It switched from main to game view.
    It gets the difficulty and then populates the game board accordingly.
  */
  function initialiseGame() {
    setCountZero();
    setTimer();
    gameView();
    let difficulty = setDifficulty();
    populateBoard(difficulty);
  }

  /**
    This function resets the game elements except for the timer.
    The number of selected cards are set to 0. The set counter is set to 0.
    It gets the difficulty and re populates the game board accordingly.
  */
  function refreshGame() {
    SELECTED = 0;
    setCountZero();
    gameView();
    let difficulty = setDifficulty();
    populateBoard(difficulty);
  }

  /**
  This function stops the game, resets all values, clears the timer and takes the user back
  to the main view.
  */
  function backToMain() {
    SELECTED = 0;
    setCountZero();
    clearInterval(TIMER);
    TIME = 0;
    mainView();
  }
})();
