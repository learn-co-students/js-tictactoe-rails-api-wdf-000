const board = [
  'td[data-x="0"][data-y="0"]', 'td[data-x="1"][data-y="0"]', 'td[data-x="2"][data-y="0"]',
  'td[data-x="0"][data-y="1"]', 'td[data-x="1"][data-y="1"]', 'td[data-x="2"][data-y="1"]',
  'td[data-x="0"][data-y="2"]', 'td[data-x="1"][data-y="2"]', 'td[data-x="2"][data-y="2"]'
];

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

var turn = 0;
var currentGame; //holds game object for update
var saveCount = 0;

function attachListeners() {
  $('td').on('click', doTurn);
  $('#previous').on('click', getAllGames);
  $('#save').on('click', savesGame);
}

function savesGame() {
  var gameData = { game: { state: captureBoard() }}
  if (saveCount >= 1) {
    $.ajax({
      url: '/games/' + currentGame.id,
      type: 'PATCH',
      data: gameData,
      success: response => currentGame = response.game
    });
  }
  else {
    $.post('/games', gameData).done(response => currentGame = response.game).fail(error => console.log(error));
    saveCount += 1;
  }
}

function autoSave() {
  var gameData = { game: { state: captureBoard() }}
  if (saveCount >= 1) {
    $.ajax({
      url: '/games/' + currentGame.id,
      type: 'PATCH',
      data: gameData,
      success: response => currentGame = undefined
    });
  }
  else {
    $.post('/games', gameData).done(response => currentGame = undefined).fail(error => console.log(error));
    saveCount += 1;
  }
}

function captureBoard() {
  return board.map(position => $(position)[0].textContent);
}

function getAllGames() {
  $.get('/games', function(response) {
    $('#games')[0].textContent = "";
    response.games.forEach(game => $('#games').append("<div>" + game.id + "</div>"));
  });
  loadPreviousGameListener();
}

function loadPreviousGameListener() {
  $('#games').on('click', 'div', function() {
    $.get('/games/' + this.textContent, function(response) {
      var i = 0;
      for (let position of board) {
        $(position)[0].textContent = response.game.state[i];
        i += 1;
      }
      turn = response.game.state.filter(element => element !== "").length
    });
  });
}

function player() {
  var currentToken = turn === 0 || turn % 2 === 0 ? "X" : "O";
  return currentToken;
}

function updateState(event) {
  var token = player();
  var x = event.currentTarget.dataset.x;
  var y = event.currentTarget.dataset.y;
  var square = 'td[data-x="' + x + '"][data-y="' + y + '"]';
  $(square).text(token);
}

function message(congratulations) {
  $('#message').text(congratulations);
}

function resetBoard() {
  autoSave();
  turn = 0;
  saveCount = 0;
}

function boardFull() {
  var state = board.map(position => $(position)[0].textContent);
  if (state.includes("")) {
    return false;
  }
  return true;
}

function checkWinner() {
  let congratulations;

  var stateOfBoard = winCombinations.map(combo => combo.map(position => $(position)[0].textContent));

  stateOfBoard.forEach(array => {
    if (array[0] !== "" && array[0] == array[1] && array[1] == array[2]) {
      congratulations = "Player " + array[0] + " Won!"
    }
  });

  if (boardFull()) {
    congratulations = "Tie game";
  }

  if (congratulations) {
    message(congratulations);
    resetBoard();
  } else {
    return false;
  }
}

function doTurn(event) {
  updateState(event);
  turn += 1
  checkWinner();
}

$(document).ready(function() {
  attachListeners();
});
