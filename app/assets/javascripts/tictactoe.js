




var turn = 0
var currentGame = 0
var id;



var win_combinations = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [6,4,2]
 ];

 $(document).ready(function(){

   attachListeners();
   saveGame();
   $('#previous').on('click', function(event){
     mostRecent();
   })


 })


function attachListeners(){
  $('td').on('click', function(event){
    event.stopPropagation();
    event.preventDefault();
    doTurn(event);
  });
}



function doTurn(event){
  updateState(event);
  turn += 1
  checkWinner();
};


function updateState(event){
  // debugger;
  $(event.target).html(player())
}


function player(){
  if(turn % 2 === 0){
    return "X";
  } else { return "O";}
};


function board(){
  var arr = []
  $('td').each(function(index, td){
    arr.push($(this).text())
  });
  return arr || []
}


function message(winner){
  $("#message").html(winner);
  reset()

}



function checkWinner(){

  var currentBoard = board();
  for(x = 0; x < win_combinations.length; x++){
    if(currentBoard[win_combinations[x][0]] && currentBoard[win_combinations[x][1]] && currentBoard[win_combinations[x][2]] !== ""){
    if(currentBoard[win_combinations[x][0]] === currentBoard[win_combinations[x][1]] &&
      currentBoard[win_combinations[x][1]] === currentBoard[win_combinations[x][2]]){
        turn = 0;

        message(`Player ${currentBoard[win_combinations[x][2]]} Won!`);
      }
    }
  }
  if (turn === 9){
    turn = 0;

    message("Tie game")
  } else {return false}
}



function saveGame(){

  $('#save').on('click', function(){

    if(currentGame === 0){
  $.ajax({
    url: '/games',
    dataType: 'json',
    method: 'POST',
    data: {
      state: board()
    }
  }).done(function(data){ currentGame = data.game.id
    $('ul').append("<li>" + "<a href=# onClick=previousGame(this) data-index-number=" + currentGame + ">" + currentGame + "</a>" + "</li>")
   })

 } else {
   $.ajax({
     url: `/games/${currentGame}`,
     dataType: 'json',
     method: 'PATCH',
     data: {
       state: board()
     }
   })
 }
})
}


function mostRecent(){
  $.ajax({
    url: '/games.json',
    method: 'GET'
  }).done(function(data){
    for(var x = 0; x < data.length; x++){
      var result = data[x]["id"]
      $('ul').append("<li>" + "<a href=# onClick=previousGame(this) data-index-number=" + result + ">" + data[x]["id"] + "</a>" + "</li>")
    }
  })
}


function reset(){
  $('td').each(function(index, td){
    $(td).html('');
  });
  currentGame = 0;
}

function previousGame(object){
  var id = object.dataset.indexNumber

  $.ajax({
    url: `/games/${id}`,
    dataType: 'json',
    method: 'GET'
  }).done(function(data){
    var gameBoard = data.game.state;

    $('td').each(function(index, td){

      $(td).html(gameBoard[index])
    })

  })

}
