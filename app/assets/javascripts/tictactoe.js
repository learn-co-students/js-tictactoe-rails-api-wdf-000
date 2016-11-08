$(document).ready(function(){
  game = new Game();
  attachListeners();
});

var WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// game constructor
class Game {
  constructor(state = new Array(9).fill("")) {
    this.id = null;
    this.state = state;
  }
}

var game;
var turn = 0;
var currentGame = 0;

// if turn count is more than 0 then the game has started so we can look into that for the patch request
// switch url inside the post according to that variable

// attach event listeners to td fields
function attachListeners() {
  $('td').on('click', function(ev) {
    doTurn(ev);
  });

  // get request to games index
  $('#previous').on('click', function() {
    $.get('/games', function(response) {
      let games = response.games;
      let html = "";
      // might need conditional to check for games' length
      $.each(games, function(index, game) {
        html += "<p>" + game.id + "</p>";
      });
      $("#games").html(html);
    });
  });

  $("#save").on("click", function() {
    processGame();
  });

  showPreviousGame();
}

// attach a listener for clicking on a previous game
function showPreviousGame() {
  $('#games').on('click', 'p', function() {
    let gameId = $(this).html();
    $.get('/games/' + gameId, function(response) {
      game = response.game;
      updateBoardState(game);
    });
  });
}

// post request to games create action
function processGame() {
  let values = JSON.stringify($(game.state));
  let url = game.id ? '/games/' + game.id : '/games';
  if (url === '/games') {
    $.ajax({
      method: 'POST',
      url: url,
      data: {
        game: {"state": values}
      }
    }).done(function(response) {
      // this updates the current game's id with the response from the server
      game.id = response.id;
    });
  } else {
    $.ajax({
      method: 'PATCH',
      url: url,
      data: {
        game: {"state": values}
      }
    }).done(function(response) {
      console.log('Game successfully updated');
    });
  }
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

// clicking cells updates game's state
function updateState(event) {
  let $target = $(event.target);
  let index = parseInt($target.attr("id"));
  let token = player();
  game.state[index] = token;
  $target.html(token);
}

function checkWinner() {
  if ( winner() !== false ) {
    processGame();
    let msg = "Player " + winner() + " Won!";
    message(msg);
    turn = 0;
    resetBoard();
  } else if (isDraw()) {
    processGame();
    message("Tie game");
    turn = 0;
    resetBoard();
  } else {
    return gameOver();
  }
  return console.log('Game finished!');
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function message(msg) {
  $('#message').html(msg);
  return msg;
}

// ******* helpers ******* //
// used to update html with game's state
function updateBoardState(game) {
  let $board = $('td');
  $.each(game.state, function(index, value) {
    let $target = $($board[index]);
    $target.html(value);
  });
}

function board(){
  let arr = $('td');
  return $.map(arr, (value, index) => value.innerHTML );
}

function won() {
  let currentBoard = board();
  let winCombo = false;
  $.each(WIN_COMBINATIONS, function(index, combo) {
    if (winCombo === false) {
      let check =
        currentBoard[combo[0]] === currentBoard[combo[1]] &&
        currentBoard[combo[1]] === currentBoard[combo[2]] &&
        currentBoard[combo[0]] !== "";
      if (check === true) {
        winCombo = combo;
      }
    }
  });
  return winCombo;
}

function boardFull() {
  let currentBoard = board();
  return currentBoard.every(elem => elem !== "");
}

function isDraw() {
  return boardFull() && !won();
}

function gameOver() {
  let currentBoard = board();
  return won() || boardFull();
}

function winner() {
  let currentBoard = board();
  let winCombo = won();
  if (winCombo !== false) {
    return currentBoard[winCombo[0]];
  }
  return false;
}

function resetBoard() {
  $('td').each(function() {
    $(this).html("");
  });
}
