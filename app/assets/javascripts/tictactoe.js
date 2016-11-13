var turn = 0;

function Game(state) {
  this.state = state;
}

var currentGame = new Game([" ", " ", " ", " ", " ", " ", " ", " ", " "]);

var winningCombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function message(string) {
  $('#message').html(string);
}

function resetBoard() {
  currentGame = new Game([" ", " ", " ", " ", " ", " ", " ", " ", " "]);
  turn = 0;
  $("td").each(function() {
    $(this).text("");
  });
}

function checkWinner() {
for(var i = 0; i < winningCombo.length; i++) {
  if (currentGame.state[winningCombo[i][0]] === currentGame.state[winningCombo[i][1]] && currentGame.state[winningCombo[i][1]] === currentGame.state[winningCombo[i][2]] && currentGame.state[winningCombo[i][1]] !== " ") {
    message('Player ' + player() + ' Won!');
    resetBoard();
    return 'Player ' + player() + ' Won!';
  }
 }
 if(turn == 8) {
   message('Tie game');
   return "tie";
 } else {
   return false;
 }
}


function player() {
  if(turn % 2 === 0){
    return "X";
  } else {
    return "O";
  };
}

function updateState(event) {
  // debugger;
  var index = parseInt(event.target.id);
  currentGame.state[index] = player();
  var target = $( event.target );
  var move = player();
  target.html(move);
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn += 1;
}

function attachListeners() {
  $('td').on('click', function(event) {
       doTurn(event);
  });
  $('#previous').click(function() {
    getAllGames();
  });
  $("#save").click(function(event) {
    saveGame(event);
  });
  $("#games").click(function(event) {
    // debugger;
    switchGame(event.target)
  })

}

function switchGame(game) {
  $.get('/games/' + game.dataset.gameid, function(response) {
    currentGame = response.game;
    updateBoard(currentGame);
  });
}

function updateBoard(game) {
  var board = $('td');
  $.each(game.state, function(index, value) {
  var target = $(board[index]);
   target.html(value);
});
}

function saveGame(event) {
  if(!currentGame.id) {
    $.ajax({
      url: '/games/',
      dataType: 'json',
      method: 'post',
      data: {
        state: currentGame.state
      }
    })
} else {
  $.ajax({
    url: '/games/' + currentGame.id,
    dataType: 'json',
    method: 'patch',
    data: {
      state: currentGame.state
    }
  });
 }
}

function getAllGames() {
  $.get('/games').done(function(data) {
      data.games.forEach(function(game){
      $("#games").append('<li data-gameid="' + game.id + '">' + "Game Number " + game.id + '</li>');
    });
  });
}
