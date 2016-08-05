var turn = xs = os = 0;
var gameId = previousGames = null
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
  
  if (gameId){
    data.game.id = gameId;
    data._method = 'patch';
    idPath = '/' + gameId;
  }

  $.post('/games' + idPath, data)
   .done(function(data){
      gameId = data['game']['id'];
   });

  if (previousGames){
    $.grep(previousGames, function(game){ return game.id == gameId; })[0].state = state;
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
  gameId = previousGames[i].id
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
    resetGame();
    return message("Player " + player() + " Won!");

  } else if (turn == 8){
    resetGame();
    return message("Tie game");
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
  $('td').text('');
  turn = xs = os = 0;
}

$(function(){
  attachListeners();
});
