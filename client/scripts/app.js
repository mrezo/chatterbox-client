// YOUR CODE HERE:
var app = {};
var message = {
  username: 'SUPER GREY ANIMAL',
  text: 'OHHHH MA GAAAAAA',
  roomname: 'aquarium'
};

app.init = function() {
  $(document).on('click', '.username', app.addFriend);
  $(document).on('click', '.submit', app.handleSubmit);
};

app.send = function() {
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

var _stringFilter = function(object) {
  var temp = object;
  var tempUsername = temp.username.split('');
  var tempText = temp.text.split(''); 
  var tempRoom = temp.roomname.split('');
  for (var i = 0; i < tempUsername.length; i++) {
    if (tempUsername[i] === '<' || tempUsername[i] === '(') {
      tempUsername[i] = ' ';
    }
  }

  temp.username = tempUsername.join('');

  for (var i = 0; i < tempText.length; i++) {
    if (tempText[i] === '<' || tempText[i] === '(') {
      tempText[i] = ' ';
    }
  }

  temp.text = tempText.join('');

  for (var i = 0; i < tempRoom.length; i++) {
    if (tempRoom[i] === '<' || tempRoom[i] === '(') {
      tempRoom[i] = ' ';
    }
  }

  temp.roomname = tempRoom.join('');

  return temp;
};

app.clearMessages = function() {
  $('#chats').empty();
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
  app.send();
};

setInterval(app.fetch, 500);

app.init();
