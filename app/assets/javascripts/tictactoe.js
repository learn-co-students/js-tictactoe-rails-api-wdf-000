var turn = 0, xs = 0, os = 0;
var ws = [0007, 0070, 0700, 0111, 0222, 0444, 0124, 0421];

function attachListeners(){
  $('td').on('click',function(){
    doTurn($(this)); 
  });
}

function doTurn(cell){
  updateState(cell);
  
  # set bit-board
  var pos = cell.data('y') * 3 + cell.data('x')
  if (turn & 1){
    xs |= 1 << pos
  } else
    os |= 1 << pos
  }

  checkWinner();
  turn ++;
}

function checkWinner(){
  var win = 0,
      playerBoard = turn & 1 ? os : xs;
  
  for (var i in ws){
    win |= !(playerBoard & ws[i] ^ ws[i]);
  }
  
  if (win){
    return message("Player " + player() + " Won!");
  } 
//  "Tie game"
}

function updateState(cell){
  cell.text(player());
}

function player(){
  return turn & 1 ? "O" : "X";
}

function message(str){
  $("#message").text(str);
}

$(function(){

  var turn = 0, xs = 0, os = 0;
  var ws = [0007, 0070, 0700, 0111, 0222, 0444, 0124, 0421];

  attachListeners();
});
