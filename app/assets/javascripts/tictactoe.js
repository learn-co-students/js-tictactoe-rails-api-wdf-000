var turn = 0;
var saved = false;
var gameId = null;
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

function attachListeners() {
  $("td").click(function(e){
    doTurn(e);
    e.stopImmediatePropagation();
  });
  $('#previous').click(function(e){
    getAllGames();
    e.stopImmediatePropagation();
  });
  $('#save').click(function(e){
    saveGame("none");
    e.stopImmediatePropagation();
  });
  $('#games').click(function(e){
    loadGame(e);
  });
}

function loadGame(event) {
  var currentId = $(event.target).data("gameid").toString();
  $.get("/games/" + currentId).done(function(data){
    $("td").each(function(index, obj) {
      $(obj).html(data['state'][index]);
    });
  });
}

function doTurn(event) {
  here = event.currentTarget;
  updateState(here);
  if(checkWinner(player()) === true) {
    saveGame("reset");
    resetBoard();
  }
  else if (turn >= 8) {
    message("Tie game");
    resetBoard();
  }
  else {turn++;}
}

function getAllGames(){
  $.get('/games', function(data){
    for(var i = 0; i < data['games'].length; i++){
      var thisId = data['games'][i]['id'];
      var findId = "game-" + thisId;
      if (document.getElementById(findId) === null){
        $('#games').append("<div class='old-game' id=" + findId + ' data-gameid=' + thisId + '> Game ' + thisId + '</div>');
      }
    }
  });
}

function saveGame(reset) {
  var gameState = $("td").map(function(index, obj){
    return $(obj).html();}).get();
  var gameParams = {'game': {'state': gameState}}
  if(gameId === null || saved === false){
    if(reset === "reset"){saved = false}
    else {saved = true}
    $.post('/games', gameParams).done(function(data){
      if(reset != "reset"){
        gameId = data['game']['id'];
      }
    });
  }
  else {
    $.ajax({
      method: "PATCH",
      url: '/games/' + gameId,
      data: {'game': {'state': gameState}}
    });
  }
}

function resetBoard(){
  $("td").each(function (index, obj){
    $(obj).html("");
  });
  turn = 0;
  gameId = null;
  saved = false;
}

function readBoard(token) {
  var results = []
  $("td").each(function (index, obj) {
    if ($(obj).html() == token){
      results.push(index);
    }
  });
  return results;
}

function checkWinner(token) {
  var places = readBoard(token);
  var win = false;
  for(combo in winCombos){
    var matches = 0;
    for(i in winCombos[combo]){
      if(places.indexOf(winCombos[combo][i]) != -1) {matches++;}
      if(matches === 3) {win = true;}
    }
  }
  if(win === true){message("Player " + token + " Won!");}
  return win;
}

function updateState(space) {
  $(space).html(player());
}

function player(){
  return ((turn % 2 === 0) ? "X" : "O");
}

function message(string) {
  $("#message").html(string);
}

$(document).ready(function(){
  attachListeners();
});
