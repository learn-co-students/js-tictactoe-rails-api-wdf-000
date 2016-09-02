var turn = 0;
var currentGame = 0;

function player(){
  if(turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function message(str){
  $('#message').html(str)
}

function currentBoard(){
  var board = []
  $('td').each(function(index){
    board.push($(this).text())
  });
  return board;
}


function resetBoard(){
  $('td').each(function(index) {
    $(this).text("");
  })
}


function checkWinner(){

  var winCombo = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var board = currentBoard();
  for(var i = 0; i < winCombo.length; i++){
    if (board[winCombo[i][0]] === board[winCombo[i][1]] && board[winCombo[i][1]] ===    board[winCombo[i][2]] && board[winCombo[i][0]] !== ""){

        message('Player ' + player()  + ' Won!');
        turn = 0;  
        saveGame(true);
        resetBoard();
        return "win";
    }
  }

  if (turn == 8){
    message('Tie game')
    turn = 0;
    saveGame(true);
    resetBoard();
    return "tie";
  } else {
    return false;
  }   
} 


function updateState(event){
  var pl = player()
  $(event.target).html(pl)
}

function doTurn(event){

  updateState(event);
  var value = checkWinner();

  if(value === false || value === undefined){
    turn += 1;  
  }
  
}


function attachListeners(){
  // if(currentGame === 0){
  //     debugger;
  //     saveGame();
  //   } 
  $('td').on('click', function(event){
    doTurn(event); 
  })

  $('#previous').click(function(){
    getAllGames();

  })
  $('#save').click(function(){
    saveGame();
  })

  $('#games').click(function(event) {
    switchGame(event.target);
  })
}

function switchGame(target) {
  
  var state = $(target).text().split(",");
  $('td').each(function(i){
    $(this).html(state[i]);
  })
}

function getAllGames(){
  $('#games').text("");

  $.get('/games').done(function(resp){
    resp.games.forEach(function(game){
       $('#games').append('<li data-gameid="' + game.id + '">' + game.state + '</li>')
    });
  })

}

function saveGame(reset){

  if(currentGame === 0 || currentGame === null){
    $.post('/games', {state: currentBoard()}).done(function(resp){
      if(reset) {
       currentGame = null;
     } else {
       currentGame = resp.game.id;
     }
    });

  } else {

    $.ajax({
      url: '/games/' + currentGame,
      dataType: 'json',
      method: 'patch',
      data: {
        state: currentBoard()
      }
    });
  }
  

}





