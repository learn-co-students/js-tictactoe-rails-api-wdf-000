$(document).ready(function() {
  attachListeners();
});

var win_combinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

var turn = 0;
var currentGame = 0;

function attachListeners() {
  $('td').on('click', function(e) {
    doTurn(e);
  });
  getAllGames();
}

function getAllGames() {
  $('#previous').on('click', function() {
    $.get('/games', function(data) {
    }).success(function(data) {
      $.each(data, function(index, value) {
        $('#games').append($('<p>'+ value.id +'</p>'));
      });
    });
  });
}

function doTurn(event, element) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  if ( winner() !== false ) {
    message("Player " + winner() + " Won!");
    turn = 0;
    resetBoard();
  } else if ( isDraw() ) {
    message("Tie game");
    turn = 0;
    resetBoard();
  } else {
    return isOver();
  }
  return console.log("Game Finished!");
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function message(string) {
  $('#message').html(string);
}

// CUSTOM HELPERS

function board() {
  return $.map($('td'), function(value, index) {
    return value.innerHTML;
  });
}

function won() {
  let boardState = board();
  let winCombo = null;
  $.each(win_combinations, function(index, combo) {
    if (winCombo === null) {
      var check =
      boardState[combo[0]] === boardState[combo[1]] &&
      boardState[combo[1]] === boardState[combo[2]] &&
      boardState[combo[0]] !== "";
      if ( check === true ) {
        winCombo = combo;
      }
    }
  });
  // returns null when board is empty or no win is detected
  return winCombo;
}

function isFull() {
  let boardState = board();
  return boardState.every(elem => elem !== "");
}

function isDraw() {
  return isFull() && !won();
}

function isOver() {
  return won() || isFull();
}

function winner() {
  let boardState = board();
  let winCombo = won();
  if ( winCombo !== null ) { 
    return boardState[winCombo[0]];
  }
  return false;
}

function resetBoard() {
  $("td").each(function() {
    $(this).html("");
  });
}