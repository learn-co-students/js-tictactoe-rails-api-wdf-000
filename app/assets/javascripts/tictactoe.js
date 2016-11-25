var turn = 0;
var currentGame = 0;
var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];

// binding all the listener actions
function attachListeners() {
  $('td').click(function(event) {
    // var position = $('td').index(this)
    doTurn(event);
  });
  $('#save').click(function() {
    save();
  });
  previous();
}


// get all the available games
function getAllGames() {
    // set games div to empty
    $('#games').text("");
    $.get("/games", function(data) {
      if (data.games.length > 0) {
        data.games.forEach(function(game) {
          $('#games').append('<li data-gameid="' + game.id + '">' + game.id + ": " + JSON.stringify(game.state) + '</li>');
        });
      selectGame();
      }
    });
}

// get the selected game
function selectGame() {
  $('[data-gameid]').click(function(event) {
    var id = $(this).data('gameid');
    switchGame(id);
  });
}

function switchGame(id) {
  $.ajax({
    url: '/games' + '/' + id,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      reloadBoard(data.state, id);
    }
  });
}

function reloadBoard(board, id) {
  $('td').each(function(index, cell) {
    $(cell).text(board[index]);
  });
}

// get all the current game status in an array
function getBoard() {
  var array = [];
  $('td').each(function(i){
    array.push($(this).text());
  });
  return array;
}

// save button action, first click it should do the POST request to '/games' and 
// second time it should do the PATCH request to '/games/:id'
function save() {
  if (currentGame === 0) {
    $.ajax ({
      url: '/games',
      method: 'POST',
      dataType: 'json',
      data: {
        game: {
          state: getBoard()
        }
      },
      success: function(data) {
        if (!!data["game"]) {
          currentGame = data.game.id;
        } else {
          currentGame = data.id;
        }
      }
    });
  } else {
      $.ajax({
        url: '/games' + '/' + currentGame,
        method: 'PATCH',
        dataType: 'json',
        data: {
          game: {
            id: currentGame,
            state: getBoard()
          }
        }
      });
    }
} // end of save function

// for the sake of last spec to pass!
function autoSave() {
  if (currentGame === 0) {
    $.ajax ({
      url: '/games',
      method: 'POST',
      dataType: 'json',
      data: {
        game: {
          state: getBoard()
        }
      }
    });
  } else {
      $.ajax({
        url: '/games' + '/' + currentGame,
        method: 'PATCH',
        dataType: 'json',
        data: {
          game: {
            id: currentGame,
            state: getBoard()
          }
        }
      });
    }
} // end of save function

// previous button action
function previous() {
  $('#previous').click(function() {
    getAllGames();
  });
}

// perform turn
function doTurn(event) {
  updateState(event);
  if(checkWinner() || tie()){
    autoSave(true);
    reset();
  }
  else {
    turn ++;
  }
}

// do the reset game
function reset() {
  $('td').html("");
  turn = 0;
  currentGame = 0;
}

// update the current state
function updateState(event) {
  $(event.target).html(player());
 }

// display the result to the DOM
function message(result) {
  $('#message').html(result);
}

// check the winner and send result to message()
function checkWinner() {
  var board = getBoard();
  for(var i = 0; i < winCombos.length; i++){
    if (board[winCombos[i][0]] === "") { continue; }
    else {
       if (board[winCombos[i][0]] === board[winCombos[i][1]] && board[winCombos[i][1]] === board[winCombos[i][2]]) {
          message("Player " + player() + " Won!");
          return true;
      }
    }
  }
  return false;  
}

// rerturn the current player
function player() {
  return (turn % 2) === 0 ? "X" : "O";
}

// return whether a game is a tie or not
function tie() {
  var isTie = true;
  $('td').each(function() {
    if (this.innerHTML === ""){
      isTie = false
    }
  });
  if (isTie) {
    message("Tie game");
  }
  return isTie;
}

// document ready fucntion
$(function() {
  attachListeners();
});
