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
  checkWinner();
  turn += 1; // make sure to check if this needs to be moved before checking winner()
}

function updateState(event) {
  var target = $(event.target);
  target.html(player());
}

function checkWinner() {
  return gameOver();
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

