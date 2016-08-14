var turn = 0;
var wins = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
var currentGame = null;

var attachListeners = function() {

	$('table tbody tr td').on('click', function(event){
		doTurn(event)
	});

	$('#previous').click(function(){
		getAllGames();
	});

	$('#save').click(function(){
		saveGame();
	});

	$("#games").click(function(event){
		changeGameState(event.target);
	});
};

function changeGameState(target) {
	var state = $(target).attr('data-state').split(",");
	currentGame = $(target).attr('data-gameid');
	fillBoard(state);
}

function fillBoard(state) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  })
}

function saveGame(reset) {
	var url, method;
  if (currentGame != null && currentGame != 0) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getState()
      }
    },
    success: function(data) {
      if(reset) {
        currentGame = null;
      } else {
        currentGame = data.game.id;
      }
    }
  });
}

var getState = function() {
  var state = $.map($("td"), function(e, i) {
  	return e.textContent
  });
  return state;
}

function getAllGames() {
  $.getJSON("/games").done(function(response) {

  	var dom = $();
    response.games.forEach(function(game) {
	    dom = dom.add($('<li>', {'data-state': game.state, 
	    												'data-gameid': game.id, 
	    												text: game.id}));
	  });
	  $("#games").html(dom);
  });
}

var doTurn = function(event) {
		updateState(event);

		if (checkWinner() || tie()) {
			saveGame(true);
			resetGame();
		} else {
			turn ++;
		}
};

var checkWinner = function(){

	for (var i = 0; i < wins.length; i++) {
		var won = checkWins(wins[i]);

		if (won === true) {
			message('Player ' + player() + ' Won!');
			return true;
		}
	}

	if (tie()) {
		message('Tie game');
	}

	return false;
};

function tie() {
  var tieGame = true;

  $("td").each(function() {
    if ($(this).html() != 'X' && $(this).html() != 'O') tieGame = false;
  });

  return tieGame;
}

function resetGame() {
	$("td").html("");
  turn = 0;
  currentGame = null;
}

function checkWins(arr) {

	for (var i = 0; i < arr.length; i++) { 
  	var x = arr[i][0];
		var y = arr[i][1];

		var cell = $('[data-x="' + x + '"][data-y="' + y + '"]').html()

		if (cell != player()) {
			return false;
		}
	}
	return true;
}

var updateState = function(event){
	$(event.currentTarget).html(player);
};

var player = function() {
	if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
};

var getIndexFrom = function(x, y) {
	return parseInt(x) + parseInt(y) * 3;
};

var message = function(msg) {
	$('#message').html(msg);
};


$(document).ready(function(){
	attachListeners();
});

