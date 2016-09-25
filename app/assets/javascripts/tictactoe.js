var turn = 0;
var currentGame = 0;
var url = '/games';
var wincombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function attachListeners() {
  $('td').each(function (index) {
    $(this).on('click', function (e) {
      // console.log($(this).data('x'));
      if ( $(this).html() != "" ) {
        return;
      } else {
        doTurn($(this));
        // debugger;
      }
    });
  });

  $('#previous').on('click', function (e) {
    getAllGames();
  });

  $('#save').on('click', function(e) {
    if (currentGame < 1) {
      $.post(url,{'game':{'state':getArray()}});
    }else{
      $.ajax({
        type: 'PATCH',
        url: ('/games/'+currentGame),
        data: {'game':{'id':currentGame,'state':getArray()}},
        success: function (data) {
          //do nothing lol
        }
      });
    }
  });

}

function setTurn(tmp) {
  turn = tmp;
}

function doTurn(obj) {
  updateState(obj);
  checkWinner();
  turn++;
}

function player() {
  if (turn%2) {
    return 'O'
  }
  else {
    return 'X'
  }
}

function updateState(obj) {
  var token = player();
  obj.html(token);
  return token;
}

function message(string) {
  $('#message').text(string);
}

function checkWinner() {
  var arr = getArray();
  for (var i = 0, len = wincombo.length; i < len; i++) {
    if ( arr[wincombo[i][0]] == "" ) { continue; }
    else {
      if ( arr[wincombo[i][0]] == arr[wincombo[i][1]] && arr[wincombo[i][0]] == arr[wincombo[i][2]] ) {
        // alert('Player ' + arr[wincombo[i][0]] + ' Win!');
        boardreset();
        return message('Player ' + arr[wincombo[i][0]] + ' Won!');
      }
    }
  }
  if ( $('td').text().length == 9 ) { 
    boardreset();
    message('Tie game'); 
  }
  return false;
}


function getAllGames() {
  $.getJSON(url, function (data) {
    var length = $('li').length;
    if ( length != 0 && length == data.games.length ) { 
      $('#games').html('');
      return; 
    }
    $('#games').html('');
    $('#games').append('<ul></ul>');
    var tmp = $('#games ul')
    data.games.forEach(function (element) {
      tmp.append('<li>' + element.id  + '</li>');
    });

    $('li').each(function (index) {
      $(this).on('click', function (e) {
        currentGame = parseInt($(this).html());
        $.getJSON(url+'/'+currentGame, function (data) {
          data = data.game;
          $('td').each(function (index,obj) {
            $(this).html(data.state[index]);
          });
          setTurn($('td').text().length);
          // debugger;
        });
      });
    });
  });
}

function getArray(){
  var arr = [];
  $('td').each(function (index) {
    arr.push($(this).html());
  });
  return arr;
}

function boardreset(){
  $.post(url,{'game':{'state':getArray()}});
  $('td').text('');
  turn = -1;
}

$(function () {
  attachListeners();
});
