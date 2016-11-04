$(document).ready(function() {
  attachListeners();
});

const win_combinations = [
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

}

// Stopped at figuring out how to take board and check against winning combinations for a win or draw or over
// And trying to translate code form
// https://github.com/ozPop/ttt-game-status-wdf-000/blob/solution/lib/game_status.rb
var board = function() {
  return $.map($('td'), function(value, index) {
    return value.innerHTML;
  });
};

function checkWin(board) {
  console.log(board);
  // let s = null;
  // $.each(win_combinations, function(index, value) {
  //   // console.log(value);
  //   s =  board[value[0]] == board[value[1]] &&
  //   board[value[1]] == board[value[1]];
  // });
  // console.log(s);
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function message(string) {
  $('#message').html(string);
}