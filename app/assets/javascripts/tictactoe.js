var turn = xs = os = 0;
var currentGame = previousGames = null
var ws = [0007, 0070, 0700, 0111, 0222, 0444, 0124, 0421];

function attachListeners(){
  $('td').on('click',function(){
    doTurn($(this)); 
  });

  $('#save').on('click',function(){
    saveGame();
  });

  $('#previous').on('click',function(){
    getPreviousGames();
  });
}

function saveGame(){
  var state = [];
  
  $('td').map((i,e) => state.push($(e).text()));
  
  var data = { game: {state: state} },
      idPath = '';
  
  if (currentGame){
    data.game.id = currentGame;
    data._method = 'patch';
    idPath = '/' + currentGame;
  }

  $.post('/games' + idPath, data)
   .done(function(data){
      currentGame = data['game']['id'];
   });

  if (previousGames){
    $.grep(previousGames, function(game){ return game.id == currentGame; })[0].state = state;
  }
}

function getPreviousGames(){
  $.get('/games',function(data){
 
    previousGames = data['games'];
    $('#games').html('');  

    $.each(previousGames,function(i,game){
      $('#games').append(
        '<div data-gameid="' + game.id + '" onClick="renderGame(' + i + ')">' +
        'Game ' + game.id +
        '</div>'
      )
    });
  });
}

function renderGame(i){
  currentGame = previousGames[i].id
  turn = 0;

  $.each(previousGames[i].state,function(j,cell){
    var x = j % 3,
        y = Math.floor(j / 3);

    $('[data-x="' + x + '"][data-y="' + y + '"]').text(cell);

    if (cell){
      turn++; 
    }
  });
}

function doTurn(cell){
  updateState(cell);
  
  // set bit-board
  var pos = cell.data('y') * 3 + cell.data('x')

  if (turn & 1){
    os |= 1 << pos
  } else {
    xs |= 1 << pos
  }

  if (!checkWinner()){
    turn ++;
  }
}

function checkWinner(){
  var win = 0,
      playerBoard = turn & 1 ? os : xs;
  
  for (var i in ws){
    win |= !(playerBoard & ws[i] ^ ws[i]);
  }
  
  if (win){
    message("Player " + player() + " Won!");
    return resetGame();

  } else if (turn == 8){
    message("Tie game");
    return resetGame();
  }

  return false;
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

function resetGame(){
  saveGame();
  $('td').text('');
  turn = xs = os = 0;
  return true;
}

$(function(){
  attachListeners();
});
