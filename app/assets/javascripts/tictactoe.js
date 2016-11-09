'use strict';

var board;
var turn;
var currentGame;
var combo;
var token;
var winner;

const winCombinations = [
  ['td[data-x="0"][data-y="0"]', 'td[data-x="1"][data-y="1"]', 'td[data-x="2"][data-y="2"]'],
  ['td[data-x="0"][data-y="2"]', 'td[data-x="1"][data-y="1"]', 'td[data-x="2"][data-y="0"]'],
  ['td[data-x="0"][data-y="0"]', 'td[data-x="1"][data-y="0"]', 'td[data-x="2"][data-y="0"]'],
  ['td[data-x="0"][data-y="1"]', 'td[data-x="1"][data-y="1"]', 'td[data-x="2"][data-y="1"]'],
  ['td[data-x="0"][data-y="2"]', 'td[data-x="1"][data-y="2"]', 'td[data-x="2"][data-y="2"]'],
  ['td[data-x="0"][data-y="2"]', 'td[data-x="0"][data-y="1"]', 'td[data-x="0"][data-y="0"]'],
  ['td[data-x="1"][data-y="2"]', 'td[data-x="1"][data-y="1"]', 'td[data-x="1"][data-y="0"]'],
  ['td[data-x="2"][data-y="2"]', 'td[data-x="2"][data-y="1"]', 'td[data-x="2"][data-y="0"]'],
];



function equalsX(element, index, array){
  return element === "X";
}
function equalsO(element, index, array){
  return element === "O";
}
function taken(event){
  return event.currentTarget.innerHTML !== '';
}
function getBoard(){
  var elements = $('td').map(function (){return this.innerText;});
  return jQuery.makeArray(elements);
}

function autoSave(){
  var tokens = getBoard();
  var game = {"game": {"state": tokens}};
  if(currentGame == 0){
    $.ajax({
      url: '/games',
      method: 'POST',
      data: game
    });
  } else {
    game["game"]["id"] = currentGame;
    var url = '/games' + '/' + currentGame
    $.ajax({
      url: url,
      method: 'PATCH',
      data: game
    });
  }
}

function saveGame(){
  var tokens = getBoard();
  var game = {"game": {"state": tokens}};
  if(currentGame == 0){
    $.ajax({
      url: '/games',
      method: 'POST',
      data: game
    }).done(function(data){
      // debugger;
      if (!!data["game"]){
        currentGame = data["game"]["id"];
      } else {
        currentGame = data["id"];
      }
    });
  } else {
    game["game"]["id"] = currentGame;
    var url = '/games' + '/' + currentGame
    $.ajax({
      url: url,
      method: 'PATCH',
      data: game
    });
  }
}

function checkTie(){
  board = getBoard();
  var tie = true;
  for(var i = 0; i<board.length;i++){
    if (board[i]===""){
      tie = false;
      break;
    }
  }
  return tie;
}

function resetBoard(){
  turn = 0;
  currentGame = 0;
  $("td").each(function(){
    this.innerHTML = "";
  });
}

function setGame(stateHash){
  var cells = JSON.parse(stateHash);
  $("td").each(function(index, node){
    node.innerHTML = cells[index];
  });
  var numX = cells.reduce(function(counter, item){ return counter + (item === "X" ? 1 : 0); }, 0);
  var numO = cells.reduce(function(counter, item){ return counter + (item === "O" ? 1 : 0); }, 0);
  turn = numX + numO;
}

function getGame(event){
  var gameId = event.currentTarget.innerText;
  var blaaa = $('li[data-gameid="' + gameId + '"] div')[0].innerText
  currentGame = gameId;
  setGame(blaaa);
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function message(msg){
  $('#message')[0].innerText = msg;
}

function updateState(event){
  token = player();
  if (taken(event)){
    alert("That spot is already taken! You wasted your turn!");
  } else {
    event.currentTarget.innerHTML = token;
  }
}


function checkWinner(){
  for (var i = 0; i < winCombinations.length; i++){
    combo = winCombinations[i].map(function (combination){
      return $(combination)[0].innerText;
    });
    if (combo.every(equalsX)){

      message("Player X Won!");
      $.when( autoSave()).then( resetBoard());
      return true;
    } else if (combo.every(equalsO)){
      message("Player O Won!");
      $.when( autoSave()).then( resetBoard());
      return true;
    } else {  //continue checking combos
    }
  }
  return false;
}

function doTurn(event){
  updateState(event);
  turn++;
  winner = checkWinner();
  if (!winner){
    if(checkTie()){
      message("Tie game");
      $.when( autoSave()).then( resetBoard());
    }
  }
}

function attachListeners(){
  ///Watch clicks on the grid
  $('td').bind("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    doTurn(event);
  });

  $('#save').bind("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    saveGame();
  });

  ///Watch for clicks in the previous games button and list after it has been generated
  $('#previous').bind("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    $.get('/games', function(data){
      if(data["games"].length > 0){
        var gameList = '';
        data["games"].forEach(function(game){
          var stateString = JSON.stringify(game["state"]);
          gameList += '<li data-gameid="' + game["id"] + '">' + game.id;
          gameList += '<div style="display: none;">' + stateString + '</div>';
          gameList += '</li>';
        })
        $('#games')[0].innerHTML = gameList;

        ///now that there is a list, attach listeners
        $('#games li').bind("click", function(event){
          event.stopPropagation();
          getGame(event);
        });

      }
    });
  });

}


$(document).ready(function(){
  attachListeners();
  turn = 0;
  currentGame = 0;
});
