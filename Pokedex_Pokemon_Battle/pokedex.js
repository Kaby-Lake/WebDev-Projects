/*
  This javascript file provides functionality to pokedex.html.
  It fetches information from the pokedex api.
  It populates the board with pokemon sprites and provides information
  on found pokemnons when they are clicked.
  When the start button is clicked, a game begins.
  When a game ends a new pokemon is added ti the pokedex if we win, else not.
*/
(function() {
  'use strict';
  window.addEventListener('load', init);

  //global variables
  const URL = 'https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/';
  const POKEDEX = URL + 'pokedex.php';
  const GAME = URL + 'game.php';
  let GUID = '';
  let PID = '';
  let START_GAME = {};
  let MOVE_EVENT = {};
  let MAX_HP_ME = '';
  let MAX_HP_OTHER = '';
  const FETCH_PARAMS_GET = {
    method: 'GET',
    mode: 'cors'
  };

  /**
    Initialises the main view of the game. Is called when the window loads.
  */
  function init() {
    mainView();
  }

  /**
    Requests data from the pokedex api. Checks the status of the request
    and then passed the data to populateBoard().
  */
  function mainView() {
    fetch(POKEDEX + '?pokedex=all', FETCH_PARAMS_GET)
      .then(checkStatus)
      //.then(JSON.parse)
      .then(populateBoard)
      .catch(console.error);
  }

  /**
    @param {string} data - contains names of all pokemon.
    Splits the short and long names and stores them.
    Calls addSprites() to populate the board with sprites.
  */
  function populateBoard(data) {
    data = data.split('\n');
    let longNames = [];
    let shortNames = [];
    for (let i = 0; i < data.length; i++) {
      let names = data[i].split(':');
      longNames.push(names[0]);
      shortNames.push(names[1]);
    }
    addSprites(shortNames);
  }
  /**
    @param {array} shortNames - contains a list of all the pokemon names
    For each name, fetches data about that pokemon and then adds the
    sprite to board.
  */
  function addSprites(shortNames) {
    for (let i = 0; i < shortNames.length; i++ ) {
      let queryName = shortNames[i];
      fetch(POKEDEX + '?pokemon=' + queryName, FETCH_PARAMS_GET)
        .then(checkStatus)
        .then(JSON.parse)
        .then(addToBoard)
        .catch(console.error);
    }
  }

  /**
    @param {object} data - contains data about a pokemon
    Adds the pokemon sprite image to the board.
    If the pokemon is Bulbasaur, Charmander or Squirtle then makes them
    visible and clickable.
  */
  function addToBoard(data) {
    let board = document.getElementById('pokedex-view');
    let shortName = data['shortname'];
    let longName = data['name'];
    let imageToAdd = document.createElement('img');
    imageToAdd.src = URL + 'sprites/' + shortName + '.png';
    imageToAdd.alt = longName;
    imageToAdd.classList.add('sprite');
    if (longName === 'Bulbasaur' || longName === 'Charmander' || longName === 'Squirtle') {
      imageToAdd.classList.add('found');
      imageToAdd.addEventListener('click', function() {
        let card = document.querySelector('#p1 .card');
        displayCardInfo(card, data);
      });
    }
    board.appendChild(imageToAdd);
  }

  /**
    @param {object} card - the div that storec card info
    @param {object} data - contains data about a pokemon
    Adds card information to the left card view for the sprite that is clicked.
    After all information is added, the start button is made visible.
  */
  function displayCardInfo(card, data) {
    let elements = card.children;
    elements[0].src = URL + data['images']['typeIcon'];
    elements[0].alt = 'Type: ' + data['info']['type'];
    elements[1].innerText = '' + data['hp'] + 'HP';
    elements[2].innerText = data['name'];
    elements[3].firstElementChild.src = URL + data['images']['photo'];
    elements[3].firstElementChild.alt = data['name'];
    elements[4].innerText = data['info']['description'];
    addMoves(elements[5], data);
    elements[6].src = URL + data['images']['weaknessIcon'];
    elements[6].alt = 'Weakness: ' + data['info']['weakness'];
    let start = document.getElementById('start-btn');
    start.removeEventListener('click', START_GAME);
    START_GAME = function(){
                  gameView(card.children[5], data['shortname']);
                  start.classList.add('hidden');
                };
    if (card.parentElement.parentElement.id === 'p1') {
      start.classList.remove('hidden');
    }
    start.addEventListener('click', START_GAME);
  }

  /**
    @param {object} container - the div element that contains moves
    @param {object} data - contains data about a pokemon
    This function adds the moves to the left card view for a given pokemon.
    Whenever the containers are more than the moves, the extra containers are
    disabled.
  */
  function addMoves(container, data) {
    let moves = data['moves'];
    let containers = container.children;
    for (let i = 0; i < containers.length; i++) {
      containers[i].classList.remove('hidden');
    }
    for (let i = 0; i < moves.length; i++) {
      let name = moves[i]['name'];
      let type = moves[i]['type'];
      let dp = moves[i]['dp'];
      let elements = containers[i].children;
      elements[0].innerText = name;
      if (dp !== undefined) {
        elements[1].innerText = dp + ' DP';
      }
      else {
        elements[1].innerText = '';
      }
      elements[2].src = URL + 'icons/' + type + '.jpg';
      elements[2].alt = 'Move Type: ' + type;
    }
    let i = moves.length;
    for (i; i < containers.length; i++) {
      containers[i].classList.add('hidden');
    }
  }

  /**
    @param {object} moveContainer - a list of all the moves of the current pokemon
    @param {string} shortName - the short name of a pokemon.
                                It is referenced in the api using this
    This method hides the pokedex and isplays the results container.
    This method calls the populateSecondCard and then plays the game by calling playGame.
  */
  function gameView(moveContainer, shortName) {
    let pokedex = document.getElementById('pokedex-view');
    pokedex.classList.add('hidden');
    let params = new FormData();
    params.append('startgame', 'true');
    params.append('mypokemon', shortName);
    fetch(GAME,{method: 'POST', body: params})
      .then(checkStatus).then(JSON.parse)
      .then(populateSecondCard).catch(console.error);
    let hp = document.querySelector('#p1 .hp-info');
    hp.classList.remove('hidden');
    let results = document.getElementById('results-container');
    results.classList.remove('hidden');
    let flee = document.getElementById('flee-btn');
    flee.classList.remove('hidden');
    let containers = moveContainer.children;
    for (let i = 0; i < containers.length; i++) {
      containers[i].disabled = false;
    }
    let heading = document.querySelector('h1');
    heading.innerText = 'Pokemon Battle Mode!';
    playGame();
  }

  /**
    @param {object} data - contains data about the current state of the game
    This method makes the 2nd card container visible and then displays the card info.
  */
  function populateSecondCard(data){
    GUID = data['guid'];
    PID = data['pid'];
    MAX_HP_ME = data['p1']['hp'];
    MAX_HP_OTHER = data['p2']['hp'];
    let cardContainer = document.getElementById('p2');
    cardContainer.classList.remove('hidden');
    let card = document.querySelector('#p2 .card');
    displayCardInfo(card, data['p2']);
  }

  /**
    This method activates the flee button, and if a move is clicked it fetches data from the api
    and then calls makeMove.
  */
  function playGame() {
    let flee = document.getElementById('flee-btn');
    flee.addEventListener('click' , function(){
      let p1MoveElement = document.getElementById('p1-turn-results');
      p1MoveElement.innerText = 'Player 1 played flee and lost!';
      p1MoveElement.classList.remove('hidden');
      let p2MoveElement = document.getElementById('p2-turn-results');
      p2MoveElement.classList.add('hidden');
      let healthBar = document.querySelector('#p1 .health-bar');
      healthBar.style.width = '0%';
      endGame(false, '');
    });
    let card1 = document.querySelector('#p1 .card');
    let moves = card1.children[5].children;
    MOVE_EVENT = function(){
                  let loading = document.getElementById('loading');
                  loading.classList.remove('hidden');
                  let params = new FormData();
                  params.append('guid', GUID);
                  params.append('pid', PID);
                  params.append('movename', this.getElementsByClassName('move')[0].innerText);
                  fetch(GAME,{method: 'POST', body: params})
                    .then(checkStatus).then(JSON.parse)
                    .then(makeMove)
                    .catch(console.error);
                };
    for (let i = 0; i < moves.length; i++) {
      if (!(moves[i].classList.contains('hidden'))) {
        moves[i].addEventListener('click', MOVE_EVENT);
      }
    }
  }

  /**
    @param {object} data - contains data about the current state of the game
    This function adds the result of the move to the results area.
    Then it calls move effect to display the effects of the move.
  */
  function makeMove(data) {
    let loading = document.getElementById('loading');
    loading.classList.add('hidden');
    let p1Move = data['results']['p1-move'];
    let p2Move = data['results']['p2-move'];
    let p1Result = data['results']['p1-result'];
    let p2Result = data['results']['p2-result'];
    let p1MoveElement = document.getElementById('p1-turn-results');
    let p2MoveElement = document.getElementById('p2-turn-results');
    p1MoveElement.classList.remove('hidden');
    p2MoveElement.classList.remove('hidden');
    p1MoveElement.innerText = 'Player 1 played ' + p1Move + ' and it ' + p1Result + '!';
    p2MoveElement.innerText = 'Player 2 played ' + p2Move + ' and it ' + p2Result + '!';
    moveEffect(data['p1'], data['p2'], p1Move, p1Result, 'p2');
    if (p2Result !== null) {
      moveEffect(data['p2'], data['p1'], p1Move, p2Result, 'p1');
    }
    else {
      p2MoveElement.classList.add('hidden');
    }
  }

  /**
    @param {object} attacker - info about the attacking pokemon
    @param {object} deffender - info about the deffending pokemon
    @param {string} move - info about the move played
    @param {string} result - info about the result of the move
    @param {string} deffenderID - p1 or p2. The id of the card container for the deffender.
    This method updates the health bar and the buffs/debuffs column depending
    on the current state of the game.
    If health reaches 0, endGame is called.
  */
  function moveEffect(attacker, deffender, move, result, deffenderID) {
    let healthBar = document.querySelector('#' + deffenderID + ' .health-bar');
    healthBar.style.width = '' + (deffender['current-hp']/deffender['hp'])*100 + '%';
    let hp = document.querySelector('#' + deffenderID + ' .hp');
    hp.innerText = '' + deffender['current-hp'] + 'HP';
    if (deffender['current-hp'] < (deffender['hp'] * 0.2)) {
      healthBar.classList.add('low-health');
    }
    if (deffenderID == 'p1') {
      changeBuffs('p1', deffender);
      changeBuffs('p2', attacker);
    }
    else {
      changeBuffs('p1', attacker);
      changeBuffs('p2', deffender);
    }
    if (deffender['current-hp'] == 0 & deffenderID == 'p1') {
      let victory = false;
      let heading = document.querySelector('h1');
      heading.innerText = 'You lost!';
      endGame(victory, '');
    }
    if (deffender['current-hp'] == 0 & deffenderID == 'p2') {
      let victory = true;
      let heading = document.querySelector('h1');
      heading.innerText = 'You won!';
      endGame(victory, deffender, attacker);
    }
  }

  /**
    @param {object} card - the div that storec card info
    @param {object} data - info about a pokemon
    This is a helper function for moveEffect. It updates the buff/debuff column for the given
    pokemon.
  */
  function changeBuffs(card, data) {
    let displayArray = document.querySelector('#' + card + ' .buffs');
    displayArray.classList.remove('hidden');
    displayArray.innerHTML = '';
    let buffs = data['buffs'];
    let debuffs = data['debuffs'];
    for (let i = 0; i < buffs.length; i++) {
      let toAdd = document.createElement('div');
      toAdd.classList.add('buff');
      if (buffs[i] == 'attack') {
        toAdd.classList.add('attack');
      }
      if (buffs[i] == 'accuracy') {
        toAdd.classList.add('accuracy');
      }
      if (buffs[i] == 'defense') {
        toAdd.classList.add('defense');
      }
      displayArray.appendChild(toAdd);
    }
    for (let i = 0; i < debuffs.length; i++) {
      let toAdd = document.createElement('div');
      toAdd.classList.add('debuff');
      if (debuffs[i] == 'attack') {
        toAdd.classList.add('attack');
      }
      if (debuffs[i] == 'accuracy') {
        toAdd.classList.add('accuracy');
      }
      if (debuffs[i] == 'defense') {
        toAdd.classList.add('defense');
      }
      displayArray.appendChild(toAdd);
    }
  }

  /**
    @param {boolean} victory - represents whether player 1 won or not.
    @param {object} deffender - info about the deffending pokemon
    The end game function hides results area, flee button and disables all moves.
    Then it calls returnMain
  */
  function endGame(victory, deffender, attacker) {
    let flee = document.getElementById('flee-btn');
    flee.classList.add('hidden');
    let end = document.getElementById('endgame');
    end.classList.remove('hidden');
    let card = document.querySelector('#p1 .card');
    let moves = card.children[5].children;
    for (let i = 0; i < moves.length; i++) {
      moves[i].removeEventListener('click', MOVE_EVENT);
      moves[i].disabled = true;
    }
    end.addEventListener('click', function(){
      returnMain(victory, deffender, attacker);
      end.classList.add('hidden');
    });
  }

  /**
    @param {boolean} victory - represents whether player 1 won or not.
    @param {object} deffender - info about the deffending pokemon
    This function resets all buffs/debuffs and health bars.
    It hides the end button and makes the start button visible.
    If player 1 wins then makeVisible is called.
  */
  function returnMain(victory, deffender, attacker) {
    let p1MoveElement = document.getElementById('p1-turn-results');
    p1MoveElement.innerText = '';
    let p2MoveElement = document.getElementById('p2-turn-results');
    p2MoveElement.innerText = '';
    let results = document.getElementById('results-container');
    results.classList.add('hidden');
    let card2 = document.getElementById('p2');
    card2.classList.add('hidden');
    let displayArray1 = document.querySelector('#p1 .buffs');
    displayArray1.innerHTML = '';
    displayArray1.classList.add('hidden');
    let displayArray2 = document.querySelector('#p2 .buffs');
    displayArray2.innerHTML = '';
    let healthBar1 = document.querySelector('#p1 .health-bar');
    healthBar1.style.width = '100%';
    healthBar1.classList.remove('low-health');
    let healthBar2 = document.querySelector('#p2 .health-bar');
    healthBar2.style.width = '100%';
    healthBar2.classList.remove('low-health');
    let hp1 = document.querySelector('#p1 .hp');
    hp1.innerText = '' + MAX_HP_ME + 'HP';
    let hp2 = document.querySelector('#p2 .hp');
    hp2.innerText = '' + MAX_HP_OTHER + 'HP';
    let hpInfo = document.querySelector('#p1 .hp-info');
    hpInfo.classList.add('hidden');
    let start = document.getElementById('start-btn');
    start.classList.remove('hidden');
    let heading = document.querySelector('h1');
    heading.innerText = 'Your Pokedex.';
    let board = document.getElementById('pokedex-view');
    board.classList.remove('hidden');
    if (victory) {
      makeVisible(deffender, board);
    }
    let card = document.querySelector('#p1 .card');
    displayCardInfo(card, attacker);
  }

  /**
    @param {object} data - information about a pokemon.
    @param {object} board - the pokedex which contains all sprites.
    Makes the pokemon sprite visiable and clickable.
  */
  function makeVisible(data, board) {
    let sprites = board.children;
    for (let i = 0; i < sprites.length; i++) {
      if (sprites[i].src.includes(data['shortname'])) {
        sprites[i].classList.add('found');
        sprites[i].addEventListener('click', function() {
          let card = document.querySelector('#p1 .card');
          displayCardInfo(card, data);
        });
      }
    }
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
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
