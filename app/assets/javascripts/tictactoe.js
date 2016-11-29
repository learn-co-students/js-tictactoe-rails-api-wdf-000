$(function(){
  attachListeners();
});

$(document).on("click",".eachGame",function(e){

    loadGame(e.target);
});

var turn = 0;

function attachListeners(){
 $('td').on('click', function(event){

   doTurn(event.target);
   player();
   checkWinner();
 });

}


function doTurn(dimension){
  message('')
  updateState(dimension);
  checkWinner();
  turn += 1;
}


function player(){
  if (turn %2 == 0){
    return 'X'
  }else{
    return 'O'
  }

}

function updateState(updateDimension){
  updateDimension.append(player())

}

function message(winner){

  $("#message").text(`${winner}`);
}


function checkWinner(){
  if($('td#one').text() == "X" && $('td#two').text() == "X" && $('td#three').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#four').text() == "X" && $('td#five').text() == "X" && $('td#six').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#seven').text() == "X" && $('td#eight').text() == "X" && $('td#nine').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#one').text() == "X" && $('td#five').text() == "X" && $('td#nine').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#three').text() == "X" && $('td#five').text() == "X" && $('td#seven').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#one').text() == "X" && $('td#four').text() == "X" && $('td#seven').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#two').text() == "X" && $('td#five').text() == "X" && $('td#eight').text() == "X"){
        // $("#message").text('Player X Won!');
        message('Player X Won!')
        save()
  }else if($('td#three').text() == "O" && $('td#six').text() == "O" && $('td#nine').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#one').text() == "O" && $('td#two').text() == "O" && $('td#three').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#four').text() == "O" && $('td#five').text() == "O" && $('td#six').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#seven').text() == "O" && $('td#eight').text() == "O" && $('td#nine').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#one').text() == "O" && $('td#five').text() == "O" && $('td#nine').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#three').text() == "O" && $('td#five').text() == "O" && $('td#seven').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#one').text() == "O" && $('td#four').text() == "O" && $('td#seven').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#two').text() == "O" && $('td#five').text() == "O" && $('td#eight').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else if($('td#three').text() == "O" && $('td#six').text() == "O" && $('td#nine').text() == "O"){
        // $("#message").text('Player O Won!');
        message('Player O Won!')
        save()
  }else{
    arr = $('td').text().split('')
    if (arr.length == 9){
    $("#message").text('Tie game');
    $('td').html('')
    resetBoard();
  }else{
    return false;
  }
  }
}
 function getGame(){
   var arr = [$('td#one').text(),$('td#two').text(),$('td#three').text(),$('td#four').text(),$('td#five').text(),
          $('td#six').text(),$('td#seven').text(),$('td#eight').text(),$('td#nine').text()];
    return arr
 }
function save(){
  ar = getGame();
  $.ajax({
    type: 'post',
    url: '/games',
    dataType: 'json',
    data:{
     "game" : ar
    }
  }).done(function(data){
      if(data){
        resetBoard();
      }
  });
}

function loadGames(games){
  $('div#games ul').html('')
  for(var i =0; i< games.length; i++){
    $('div#games ul').append(`<li><a class= "eachGame" href="#" id ='${games[i].id}'>${games[i].id}</a></li>`)
  }
}

function prevGames(){
  $.ajax({
    type: 'get',
    url: '/games.json',
    dataType: 'json',
  }).done(function(data){

    var gamess = data['games']
    loadGames(gamess)

  });
}

function loadGame(clickedLink){
  var prevGame = ""
 var gameId = clickedLink.id;
   $.ajax({
     type: 'get',
     url: `/games/${gameId}.json`,
     dataType: 'json',
   }).done(function(data){

      prevGame = JSON.parse(data['state']);
      showGame(prevGame);
   });
}

function showGame(game){
  $('td#one').text(game[0]);
  $('td#two').text(game[1]);
  $('td#three').text(game[2]);
  $('td#four').text(game[3]);
  $('td#five').text(game[4]);
  $('td#six').text(game[5]);
  $('td#seven').text(game[6]);
  $('td#eight').text(game[7]);
  $('td#nine').text(game[8]);
  turn = game.length;
}
function resetBoard(){
  $('td').text('')
  turn = 0;
}
