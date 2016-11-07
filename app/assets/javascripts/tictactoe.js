$(document).ready(function(){
  game = new Game();
  assignGameId();
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
  constructor(id = null, state = new Array(9).fill("")) {
    this.id = id;
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
    $.get('/games', function(games) {
    }).done(function(games){
      let $games = $(games);
      $games.each(function(index, game) {
        $("#games").append("<p>" + game.id + "</p>");
      });
    });
  });

  // post request to games create action
  $("#save").on("click", function() {
    let values = JSON.stringify($(game.state));
    let posting = $.post("/games", {state: values});
  });
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
    let msg = "Player " + winner() + " Won!";
    message(msg);
    turn = 0;
    resetBoard();
  } else if (isDraw()) {
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
// get last game id from database
function assignGameId() {
  $.get('/games', function(response) {
  }).done(function(response) {
    id = response[response.length -1].id + 1;
    game.id = id;
  });
}

// used to update html with game's state
function updateBoardState(gameState) {
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
  // game = new Game();
  // updateBoardState(game.state);
}
