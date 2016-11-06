$(document).ready(function(){
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

var turn = 0;

// attach event listeners to td fields
function attachListeners() {
  $('td').on('click', function(ev) {
    doTurn(ev);
  });
}

function doTurn(event) {
  updateState(event);
  turn += 1; // make sure to check if this needs to be moved before checking winner()
  checkWinner();
}

function updateState(event) {
  var target = $(event.target);
  target.html(player());
}

function checkWinner() {
  // if (gameOver() && ) {
  // }
  // let winningToken = winner();
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
}

// helpers
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
