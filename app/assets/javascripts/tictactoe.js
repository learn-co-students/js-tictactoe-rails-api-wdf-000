$(function(){
  attachListeners();
});
//^document ready function call//

//JavaScript ticTacToe
var turn = 0;
var currentGame = 0;
var winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function attachListeners() {
  $("td").click(function(event) {
    doTurn(event); 
  });
  getAllGames();
  save();
  showGame();
}

function reset() {
  $("td").html("");
  turn = 0;
  currentGame = 0; 
}

function doTurn(event) {
  updateState(event);
  if(checkWinner() || tie()){
    autoSave();
    reset();
  } else {
    turn ++;
  }
}

function player() {
  if(turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  $(event.target).html(player());
}

function readBoard() { 
  var boardText = [];
  $("td").each(function(element) {
    boardText.push($(this).text());
  });
  return boardText;
}

function checkWinner() {
  var board = readBoard(); 
  function isWinComboX(element, index, array) {
    return board[element] === "X";
  } 

  function isWinComboO(element, index, array) {
    return board[element] === "O";
  } 

  function anyWin(element) {
    return element.every(isWinComboX) || element.every(isWinComboO)
  }
  
  var checkResult = winCombo.find(anyWin);
  
  if(checkResult !== undefined) {
    message("Player " + player() + " Won!");
    return true;
  } else {
    return false;
  }

}

function tie() {
  var board = readBoard();
  function emptyCell(element) {
    return element === "";
  }

  if(board.find(emptyCell) === undefined && !checkWinner()) {
    message("Tie game");
    return true;
  } else {
    return false;
  }
}

function message(gamemsg) {
  $("#message").html(gamemsg);
}

//Persistence Functionality

function getAllGames() {
  $("#previous").click(function() {
    //reset games div
    $('#games').html("");
    $.get("/games", function(data) {
      if (data.games.length > 0) {
        var html = "";
        data.games.forEach(function(game) {
          html += '<ul>' + '<li data-gameid="' + game.id + '">' + game.id + '</li>' + '</ul>';
        });
        $("#games").append(html);
      }
    });
  });
}

function save() {
  $("#save").click(function() {
    var url, method;
    
    if(currentGame === 0) {
      url = "/games";
      method = "POST";
    } else {
      url = "/games/" + currentGame;
      method = "PATCH";
    }
    
    $.ajax({
      url: url,
      method: method,
      dataType: "json",
      data: {game: {state: readBoard()}}
    }).done(function(data) {
        currentGame = data.game.id;
    });
   
  });
}

function autoSave() {
  var url, method;

  if(currentGame === 0) {
    url = "/games";
    method = "POST";
  } else {
    url = "/games/" + currentGame;
    method = "PATCH";
  }
  
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {game: {state: readBoard()}}
  });
}

function showGame() {
  $("#games").on("click", "li", function(event) {
    var gameid = $(event.target).data("gameid");
    $.ajax({
      url: "/games/" + gameid,
      method: "GET",
      dataType: "json"
    }).done(function(data) {
      var boardText = data.game.state;
      $("td").each(function(index) {
        $(this).text(boardText[index]);
      });
    });
  });
}
















