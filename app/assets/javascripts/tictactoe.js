var turn = 0;
var currentGame = 0;
jQuery.data( document.head, "count", 1);

$(function() {
  attachListeners();
})




function even(n) {
  return n % 2 === 0;
}

function attachListeners(){
  $('td').on("click", function(e){
    doTurn(e);
  });
  $('#previous').on("click", function() {
    $.get("/games", function(data) {
      if (data["games"].length > 0) {
        // debugger;
        var num = document.createElement("p");
        num.append(data["games"][0]["id"]);
        $('#games').append(num);
        // checkWinner();
        // var game = $('')
        // $('#games').appendChildren(data["games"][0]["id"]);
      };
    });
  });
  $('#save').on("click", function() {
    if (currentGame < jQuery.data(document.head, "count")) {
      $.post("/games");
      currentGame = currentGame + 1;
    } else {
      // $.post(`/games/${currentGame}`);
      // debugger;
      $.ajax({
        url: `/games/${currentGame}`,
        type: 'PATCH'
      });
      // currentGame = 0;
    };
  });
}

// function saveTwo() {
  // $.post("/games");
// }

function doTurn(e) {

  // console.log('in doTurn', e);
  updateState(e);
  turn++;
  checkWinner();
}

function player() {
  if (even(turn)) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(e) {
  // debugger;
  // console.log('bruh', e);
  e.target.innerHTML = player();
}

function checkWinner() {
  var one = $('[data-x="0"][data-y="0"]').text();
  var two = $('[data-x="1"][data-y="0"]').text();
  var three = $('[data-x="2"][data-y="0"]').text();
  var four = $('[data-x="0"][data-y="1"]').text();
  var five = $('[data-x="1"][data-y="1"]').text();
  var six = $('[data-x="2"][data-y="1"]').text();
  var seven = $('[data-x="0"][data-y="2"]').text();
  var eight = $('[data-x="1"][data-y="2"]').text();
  var nine = $('[data-x="2"][data-y="2"]').text();
  // debugger;
  if (one === two && two === three && three == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (one === four && four === seven && seven == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (one === five && five === nine && nine == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (two === five && five === eight && eight == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (three === six && six === nine && nine == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (five === four && four === six && six == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (nine === seven && seven === eight && eight == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (three === five && five === seven && seven == "X") {
    string = "Player X Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (one === two && two === three && three == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (one === four && four === seven && seven == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (one === five && five === nine && nine == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (two === five && five === eight && eight == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (three === six && six === nine && nine == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (five === four && four === six && six == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (nine === seven && seven === eight && eight == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  } else if (three === five && five === seven && seven == "O") {
    string = "Player O Won!";
    message(string);
    $('#save').click()
    resetBoard();
    return;
  }else if (turn === 9) {
    string = "Tie game";
    message(string);
    $('#save').click()
    resetBoard();
    // $('td').text() = ""
    // $('td').each(function() {
    //   this.text("");
    // });
    // turn = 0;
    return;
  };
  return false;
}

function resetBoard() {
  // debugger;
  $('td').text("");
  turn = 0;
  // var num = jQuery.data(document.head, "count");
  jQuery.data(document.head, "count", currentGame+1);
  // currentGame++;
}


function message(string) {
  // console.log('hello');
  // debugger;
  $("#message").text(string);
}
