var turn = 0;
var currentGame = 0;
var gameOver = false
var board = ["", "", "", "", "", "", "", "", ""];

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });

  $('#save').on('click', function() {
    save();
  });

  $('#previous').on('click', function() {
    $.ajax({
      url: "/games",
      method: "GET",
      success: function(resp) {
        resp.games.forEach(function(game) {
          $('#gamelist').append('<li id="' + game.id + '">' + game.id + '</li>')
        })
      }
    })
  });

  $('#games').on('click', 'li', function(event) {
    console.log("clicked");
    loadGame(event);
  });
}

function doTurn(cell) {
  updateState(cell);
  turn += 1
  checkWinner();
}

function save() {
  if (currentGame == 0) {
    $.ajax({
      url: '/games',
      method: 'POST',
      datatype: 'JSON',
      data: {
        game: {
          state: board
        }
      },
      success: function(resp) {
        currentGame = resp.id
        console.log("Post " + currentGame )
      }
    })
  } else {
    $.ajax({
      url: '/games/' + currentGame,
      method: 'PATCH',
      datatype: 'JSON',
      data: {
        game: {
          state: board
        }
      }
    })
    console.log("Patch " + currentGame)
  }
}

function loadGame(event) {
  var id = $(event.target).text();
  $.ajax({
    url: '/games/' + id,
    method: 'GET',
    dataType: 'JSON',
    success: function(resp) {
      board = resp.game.state;
      currentGame = resp.game.id;
      for (var i=0; i < board.length; i++) {
        $(`#${i}`).html(board[i]);
      }
    }
  })
}


function checkWinner() {
  if (gameOver == false && turn == 9) {
    msg = "Tie game";
    message(msg);
    gameOver = true
    save()
    newBoard()
  } else {
    winner();
  }
  return gameOver;
}

function winner() {
  var string;
  const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (combos in winCombinations) {
    var combo = winCombinations[combos];
    var tokens = board[combo[0]] + board[combo[1]] + board[combo[2]];
    console.log("tokens " + tokens)
    if (tokens == "XXX") {
      string = "Player X Won!";
      message(string)
      gameOver = true
      newBoard();
      console.log(gameOver)
      // debugger
    } else if (tokens == "OOO") {
      string = "Player O Won!";
      message(string)
      gameOver = true
      newBoard();
      console.log(gameOver)
    }
  }
}

function updateState(cell) {
  $(cell.target).text(player());
  i = parseInt(cell.target.id);
  board[i] = player();
}

function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O"
  };
}

function message(string) {
  $('#message').html(string);
}

function newBoard() {
  $('td').text("");
  board = ["", "", "", "", "", "", "", "", ""];
  currentGame = 0;
  turn = 0;
};

$(document).ready(function() {
 attachListeners();
})
