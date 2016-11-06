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

function attachListeners() {
  $('td').on('click', function(e) {
    doTurn(e);
  });
}

function doTurn(event, element) {
  updateState(event);
  checkWinner();
  turn += 1;
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  return isOver();
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