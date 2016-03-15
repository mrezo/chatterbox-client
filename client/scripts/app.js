var app = {};

app.init = function() {
  $(document).on('click', '.username', app.addFriend);
  $(document).on('click', '.submit', app.handleSubmit);
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.clearAll();
      var roomNames = {};
      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].username) {
          var temp = _stringFilter(data.results[i]);
          app.addMessage(temp);

          if (!roomNames[temp.roomname]) {
            $('.select').append('<option>' + temp.roomname + '</option>');
            roomNames[temp.roomname] = temp.roomname;
          }
        }
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

var _stringFilter = function(object) {
  var temp = object;

  if (temp.username) {    
    var tempUsername = temp.username.split('');
    for (var i = 0; i < tempUsername.length; i++) {
      if (tempUsername[i] === '<' || tempUsername[i] === '(') {
        tempUsername[i] = '_';
      }
    }
    temp.username = tempUsername.join('');
  } else {
    temp.username = 'anonymous';
  }

  if (temp.text) {
    var tempText = temp.text.split(''); 
    for (var i = 0; i < tempText.length; i++) {
      if (tempText[i] === '<' || tempText[i] === '(') {
        tempText[i] = '_';
      }
    }
    temp.text = tempText.join('');    
  } else {
    temp.text = '';
  }

  if (temp.roomname) {
    var tempRoom = temp.roomname.split('');
    for (var i = 0; i < tempRoom.length; i++) {
      if (tempRoom[i] === '<' || tempRoom[i] === '(') {
        tempRoom[i] = '_';
      }
    }
    temp.roomname = tempRoom.join('');    
  } else {
    temp.roomname = 'empty room';
  }


  return temp;
};

app.clearAll = function() {
  $('#chats').empty();
  $('.select').empty();
};

app.addMessage = function (message) {
  $('#chats').append('<div class="username">' + message.username + ': <span>' + message.text + '</span>' + ' </div>');
};

app.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');
};

app.addFriend = function() {
  console.log('clicked');
};

app.handleSubmit = function() {
  var message = {
    username: decodeURIComponent(document.location.search.split('=')[1]),
    text: $('input').val(),
    roomname: 'THE BEST ROOM EVA'
  };
  app.send(message);
};

app.user = function () {
  $.ajax({
    url: 'https://api.parse.com/1/users/ofNyMWNPHD',
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      app.clearMessages();
      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].username) {
          app.addMessage(_stringFilter(data.results[i]));
        }
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

setInterval(app.fetch, 500);

app.init();
