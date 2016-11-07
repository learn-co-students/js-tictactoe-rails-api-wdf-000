$(document).ready(function() {
  game = new Game();
  game.id = assignId();
  // game.id = 6;
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

var game;
var turn = 0;
var currentGame = 0;

function attachListeners() {
  $('td').on('click', function(e) {
    doTurn(e);
  });
  getAllGames();
  saveGame();
}

function getAllGames() {
  $('#previous').on('click', function() {
    $.get('/games', function(data) {
    }).done(function(data) {
      let html = "";
      $.each(data, function(index, value) {
        html += '<p>'+ value.id +'</p>';
      });
        $('#games').html(html);
    });
  });
}

function saveGame() {
  $('#save').on('click', function() {
    processGame();
    // let serializedBoard = JSON.stringify($(game.state));
    // let posting = $.post('/games', {"state": serializedBoard});
    // posting.done(function(data) {
    // });
  });
}

function processGame() {

  (function() {
    $.get('/games').done(function(data) {
      let gameIds = $.map( data, function( obj, index ) {
        return obj.id;
      });
      getUrls(gameIds);
    });
  })();

  function getUrls(gameIds) {
    let url = null;
    let id = gameIds.find(function(elem) {
      return elem === game.id;
    });

    if ( id ) {
      url = '/games/' + String(id);
    } else {
      url = '/games';
    }
    return makeRequest(url);
  }

  function makeRequest(url) {
    let serializedBoard = JSON.stringify($(game.state));
    if (url === '/games') {
      $.ajax({
        method: "POST",
        url: url,
        data: {"state": serializedBoard}
      }).done(function(msg) {
        alert( "Game Created: " + msg);
      });
    } else {
      $.ajax({
        method: "PATCH",
        url: url,
        data: {"state": serializedBoard}
      }).done(function(msg) {
        alert( "Game Updated: " + msg);
      });
    }
  }
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function checkWinner() {
  if ( winner() !== false ) {
    message("Player " + winner() + " Won!");
    turn = 0;
    resetBoard();
  } else if ( isDraw() ) {
    message("Tie game");
    turn = 0;
    resetBoard();
  } else {
    return isOver();
  }
  return console.log("Game Finished!");
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function message(string) {
  $('#message').html(string);
}

// CUSTOM HELPERS

class Game {
  constructor(state = new Array(9).fill("")) {
    this.state = state;
  }
}

function assignId() {
  $.get('/games', function(response) {
  }).done(function(response) {
    id = response[response.length -1].id + 1;
    game.id = id;
  });
}

function updateState(event) {
  let token = player();
  let $target = $(event.target);
  let index = parseInt($target.attr('id'));
  game.state[index] = token;
  $target.html(player());
}

// display stored state on the board
function updateBoardState(gameState) {
  let $board = $('td');
  $.each(game.state, function(index, value) {
    let $target = $($board[index]);
    $target.html(value);
  });
}

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

function resetBoard() {
  $("td").each(function() {
    $(this).html("");
  });
}