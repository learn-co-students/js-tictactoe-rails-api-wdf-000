$(function() {
  attachListeners()
})

var turn = 0
var board =  ["", "", "", "", "", "", "", "", ""]
const winning_combinations = [[0, 1, 2], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8]]

// function attachListeners(){
//   $("#save").on('click', function(){
//     $.ajax({
//       url: "/games",
//       method: "POST",
//       data: {
//         state: board
//         }
//     })
//   })
function attachListeners() {
  $('td').on('click', doTurn)

  $("#save").on('click', function(){
    $.ajax({
      url: "/games",
      method: "POST",
      data: {
        game: {
          state: board
        }
      }
    })
  });

  $("#previous").on('click', function(){
    $.ajax({
      url: "/games",
      method: "GET",
      success: function(data) {
        data.games.forEach(function(el) {
        var id = `${el.id}`
        var string = '<a href="games/' + id + '">' +  el.id + "</a><br>"
        $("#games").append(string);
          })
        }
      });
    });


    $("#games").on('click', function(event) {
      var link = event.toElement;
      var id = parseInt($(link).text())
      event.preventDefault();
      $.ajax({
        url: "/games/" + `${id}`,
        method: "GET",
        success: function(resp) {
          board = resp.state;
          for(var i = 0; i < board.length; i++) {
            $(`#${i}`).html(board[i]);
          }
        }
      });
    })

  };





function doTurn(event){
  updateState(event.target)
  turn += 1
  checkWinner()
}

function updateState(cell) {
  $(cell).text(player())
  board[parseInt(cell.id)] = player()
}

function player(){
  if(turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function checkWinner(){
  for(var i=0; i < winning_combinations.length; i++) {
    var pos1 = winning_combinations[i][0]
    var pos2 = winning_combinations[i][1]
    var pos3 = winning_combinations[i][2]

    if (board[pos1] == "X" && board[pos2] == "X" && board[pos3] == "X") {
      return message("Player X Won!")
    } else if (board[pos1] == "O" && board[pos2] == "O" && board[pos3] == "O") {
      return message("Player O Won!")
    }
  }
}

function message(string) {
  $("#message").text(string)
}

function clear() {
  board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
  $("#message").text("New Game")
}
