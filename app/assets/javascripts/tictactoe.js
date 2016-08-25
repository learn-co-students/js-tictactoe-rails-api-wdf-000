// to convert data-x & data-y to ruby 
// add (3 * data-x) to data-y
// so (1, 2) == array[2 + (1*3)] == array[5]
//   |  |
// --------
//   |  |x
// --------
//   |  |


var turn = 0;

var currentGame = 0;
var gamesShowing = false;
function boardToRuby () {
  return {id: null, state: getBoard()};
}



function doTurn (obj, currentPlayer) {
  turn += 1;
  
  $(obj).text(currentPlayer);
 
  updateState();
  // pickGame();
  return checkWinner();
}

function changeBoard(board, id) {
  $('td').each(function(index, cell) {
    $(cell).text(board[id]);
  });
  //window.scrollTo(0,0);
}

function switchGame(id) {
  debugger;
  $.ajax({
    url: '/games/' + id,
    method: "GET",
    success: function(resp) {
    
    changeBoard(resp.game.state, id);
  }});
  // debugger;
  // game.done(function(resp) {
  //   console.log(id);
  //   console.log(resp.game.state);
  //   //clearBoard();
  //   changeBoard(resp.game.state);
  // });
}

function saveGame() {
  if (currentGame < 1) {
    return $.post('/games', boardToRuby());
  } else {
    return $.ajax({
      url: '/games/' + currentGame,
      method: "PATCH", 
      data: boardToRuby(),
      success: function(resp) { currentGame = resp.game.id }
    });
  }
}

function getAllGames() {
  $('#games').text("");
  return $.get('/games').done(function(resp) {
    resp.games.forEach(function(game) {
      // has to be data-gameid to pass specs
      $('#games').append('<li data-gameid="' + game.id + '">' + game.id + ": " + game.state + '</li>');
    });
  }).done(function() { pickGame(); });
}

function pickGame() {
  $('[data-gameid]').on('click', function(event) {
    var id = $(this).data('gameid');
    switchGame(id);
  });
}

function attachListeners () {
  $("td").on("click", function(event) {
    var currentPlayer = player();
    doTurn(this, currentPlayer);
  });

  $('#save').on('click', function(event) {
    var posting = saveGame();
    posting.done(function (resp) {
      console.log(resp);
      currentGame = resp.game.id;
    });
    
  });

  $('#previous').on('click', function(event) {
    getAllGames();
    $('#games').show();
    // pickGame();
    // gamesShowing = true;
  });

  $('#games').hide()

  getAllGames();
}

function won() {
  combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var board = getBoard();
  combinations.forEach(function(item, index) {
    if (board[item[0]] != "" && board[item[0]] == board[item[1]] && board[item[1]] == board[item[2]]) {
      turn -= 1;
      message("Player " + player() + " Won!");
      clearBoard();
      turn = 0;
      return true
    } else {
      return false
    }
  });
  // Note to self: order of operations //
  // var posting = $.post('/check', boardToRuby());
  // var result = false;
  // posting.done(function (resp) {
    // if (resp == true) {
    //   turn -= 1;
    //   var winner = player();
    //   message("Player " + winner + " Won!");
    //   
    //   clearBoard();
    //   turn = 0;
    //   if (gamesShowing) {
	// getAllGames();
    //   }
    //   return true;
    // } else {
    //   return false;
    // }
    //
  // });
  
}

function checkWinner () {
  // var w = won();
  // console.log(w);
  if (won()) {
    // message("Player X Won!")
    // console.log("test");
  }
  if (turn == 9) {
    message("Tie game");
    turn = 0;
    return clearBoard();
  }
  // console.log(result)
  return false;
  //
}

function updateState () {

  return player();
}

function player () {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function message (msg) {
  $('#message').text(msg);
}

function getBoard() { 
  var board = [];
  $('td').each(function(index, value) {
    board.push($(value).text());
  });
  return board;
}

function clearBoard() {
  saveGame();
  $('td').each(function(index, value) {
    $(value).text("");
  })
}
