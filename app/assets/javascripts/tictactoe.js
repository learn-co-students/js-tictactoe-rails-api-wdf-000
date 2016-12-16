$(function() {

  attachListeners()
  // click handlers to the page

  message()


});




var turn = 0



function attachListeners() {

  $("td").on("click", doTurn);

  // $("td").on("click", function(){
  //   doTurn(this)
  // });
  $("#save").on("click", save)
  // doTurn()
  // client clicks on a cell, doTurn
  // should be called and passed a parameter of the event

  $("#previous").on("click", previousGames)

  // $(".gameLink").on("click", gameBoard)
  $('body').on('click', '.gameLink', gameBoard)
  // $("#").on("click", function(e){
  //   e.preventDefault
  //   console.log("link?")
  // })
}

var saved_game = ""
var saved_game_id = ""

function gameBoard(e) {
  e.preventDefault()
  // debugger;
  var id = parseInt(this.id)
  $.ajax({
    method: "GET",
    url: `/games/${id}/board`,
    success: function(data) {
      // board = data["games"]
      board = data["games"][0]

        saved_game = data
        saved_game_id = data["games"][1]
      // $("td").each(function(e) {
        // debugger;

        for (var i = 0; i < board.length; i ++) {
          // debugger
          $(`#${i}`).html(board[i])
        }

      // })
      }
  })

}

function previousGames(){
  $.ajax({
    method: "GET",
    url: "/games",
    success: function(data) {
      data["games"].forEach(function(game) {

        var id = `${game.id}`
        // debugger;
        // var el = document.createElement(`li`)
        // el.id = id

        // var string = `${game.id}`
        // var gameId = game.id
        // var result = string.link(`/games/${id}/board`)

        // var a = document.createElement('a');
        var a = $(document.createElement("a"))
        // a.setAttribute('href', `/games/${game.id}`)
        a.attr('href', `/games/${game.id}/board`)
        a.attr('class', `gameLink`)
        a.attr('value', "link")
        a.attr('id', `${game.id}`)
        // a.attr('id', `${game.id}`)
        a.text(`${game.id}`)
        // a.val = "link - "
        // // a.id = game.id
        // $("#games").append(`${a}`)

        // link = "<a href=";
        // link += '"/games/' + game.id + '"'
        //  class="1" value="link"></a>
       $("#games").append(a)
       $("#games").append("<br>")
        // .addClass(`${game.id}`)
        // $("#games").append(el)
      });

      // $("#").forEach(funtion(e) {
      //   $(this).val("game 1")
      // })

      }
    });
};

function doTurn(event) {
  // var turn = 0
  // $("td").on("click", function() {
  updateState(event.target)
  turn += 1
  // });
  // call on updateState pass it the event
  checkWinner()
}


function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  };
};

var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]


function updateState(cell) {
    //  debugger;
      $(cell).text(player())

      board[parseInt(cell.id)] = player()

}



function save() {

  if (saved_game == "") {
    $.ajax( {
      method: "POST",
      url: "/games",
      data: {state: board}
    });

  } else {
    $.ajax( {
      method: "patch",
      url: `/games/${saved_game_id}`,
      data: {state: board}
    });
  }

}


var winning_combinations = [[0, 1, 2], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8]]


function checkWinner(){
  // $.get("/games", )
  // evaluates the game to see if theres a winner
  for (var i = 0; i < winning_combinations.length; i++) {

      var pos1 = winning_combinations[i][0]
      var pos2 = winning_combinations[i][1]
      var pos3 = winning_combinations[i][2]

      // debugger

      // for (var i = 0; i < board.length; i++) {

        if (board[pos1] == "X" && board[pos2] == "X" && board[pos3] == "X") {
          // console.log("x")
          return message("Player X Won")
        } else if (board[pos1] == "O" && board[pos2] == "O" && board[pos3] == "O") {
          // console.log("O")
          // return "Player O Won"
          return message("Player O Won")
        }
        // else {

          // console.log("noone")
          // return "Nobody"
          // return message("Nobody")
        // }
      // }
    }
}




function message(string) {
  // debugger;
  $("#message").text(string)

  // setTimeout(function(){ clear(); }, 1000);
}


function clear() {
  board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
  $("#message").text("New Game")
}



// ______

// for (var k = 0; k < winning_combinations[i].length; k++) {
  // debugger
      // winning_combinations[i].forEach(function(e){
      //   // console.log(e)
      //   // debugger
      //
      //   if (board[e] == "O" && board[e + 1] == "O" && board[e + 2] == "O") {
      //     debugger
      //     console.log("O won");
      //   } else if (board[e] == "X" && board[e + 1] == "X" && board[e + 2] == "X") {
      //     debugger
      //     console.log("X won");
      //   } else {
      //     console.log("na");
      //   }
      //
      // });

                // if (board[winning_combinations[i][k]] == "O" && board[winning_combinations[i][k + 1]] == "O" && board[winning_combinations[i][k + 2]] == "O") {
                //   console.log("O won")
                //   // return "BIG O WON"
                // } else if (board[winning_combinations[i][k]] == "X" && board[winning_combinations[i][k + 1]] == "X" && board[winning_combinations[i][k + 2]] == "X") {
                //   // return "X"
                //   console.log("X won")
                // } else {
                //   console.log("nothing")
                //   // return "nothing"
                // }

  //           // if (board[winning_combinations[i][k]] == "O" && board[winning_combinations[i][k + 1]] == "O" && board[winning_combinations[i][k + 2]] == "O") {
  //           //   return "BIG O WON"
  //           // } else if (board[winning_combinations[i][k]] == "X" && board[winning_combinations[i][k + 1]] == "X" && board[winning_combinations[i][k + 2]] == "X")
  //           // else {
  //           //   return "nothing"
  //           // }
    // }
  //
  // };
  // returns who won the game for message() function to put it into div
  // if () {
  //   message("Player X Won!")
  // } else {
  //   message("Player O Won!")
  // }

// }
