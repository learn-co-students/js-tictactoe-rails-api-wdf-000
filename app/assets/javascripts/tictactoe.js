var turn = 0;
var board = [" "," "," "," "," "," "," "," "," "]
var currentGame = 0
var gameOver = false;
const winCombinations = [

  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]

]

function attachListeners(){
  $('td').on("click",e=>{
    doTurn(e);
  });

  $('#new').on("click", e=>{
    newGame();
  });

  $('#save').on("click", e=>{
    if (currentGame === 0) {
      $.ajax({
        url: '/games',
        method: 'POST',
        data: {
            state: board
        },
        success: response =>{
          var string = `<a href="games/${response.id}" id="game${response.id}">Game ${response.id}</a><br>`
          $("#games").append(string);
        }
      });
    }else {
      $.ajax({
        url: `/games/${currentGame}`,
        method: 'PATCH',
        data: {
            state: board
        }
      });

    }

  });

  $("#previous").on("click", e=>{
    e.preventDefault();
    $.ajax({
      url: "/games",
      method: "GET",
      success: response=>{
        response.games.forEach(game=>{
          $("#games").append(`<a href = "/games/${game.id}" id ="game${game.id}">Game${game.id}</a> <br>`)
        })
      }
    });
  });

  $("#games").on("click",'a', e=>{
    e.preventDefault();
    $.ajax({
      url: $(e.target).attr("href"),
      method: "GET",
      success: response=>{
        board = response.state
        board.forEach(function(e,i){
          $(`td#${i}`).text(e);
        })
      }
    });
  });
}

function doTurn(e){
  if (!gameOver) {
    updateState(e);
    checkWinner();
  }

}

function player(){
  var t;
  (turn%2 === 0) ? t = "X" : t = "O";
  return t;

}

function updateState(e){
  // currentPlayer = player();
if (!positionTaken(e)) {
  board[e.toElement.id] = player();
  e.target.innerHTML = player();
  turn+= 1;
}

}

function positionTaken(e){
  var value;
  board[e.toElement.id] === " "? (value = false) : (value = true);
  return value;
}

function checkWinner() {
  var string;
  if (!board.every(allSpaces)) {
    $.each(winCombinations, (i,v)=>{
      if (board[v[0]] === board[v[1]] && board[v[1]] === board[v[2]] && board[v[0]] !== " ") {
        string = `Player ${board[v[0]]} Won!`;
        gameOver = true;
        message(string);
      }else if (turn === 9) {
        string = "It's a Draw";
        gameOver = true;
        message(string);
      }
    });
  }
}

function message(string){
  $("#message").text(string);
}

function allSpaces(e,i,a){
	return e === " ";
}

function boardLocation(e){
  return parseInt(e.target.dataset.x) + parseInt(e.target.dataset.y);
}

function countTurn() {
  turn = 0;
  board.forEach(e=>{
    if (e ==="X" || e ==="O") {
      turn+=1
    }
  });
}

function newGame(){
  currentGame = 0;
  gameOver = false;
  turn = 0;
  board = [" "," "," "," "," "," "," "," "," "];
  $('td').each((i,v)=> {v.textContent = " "});
  $("#message").html("");
}

$(document).ready(()=>{
  attachListeners();
})
