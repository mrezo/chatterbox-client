var app = {};

app.init = function() {
  $(document).on('click', '#chats div', function() {
    if ($(this).attr('class')) {
      var roomName = $(this).attr('class').split(' ')[1];
      app.fetch(roomName);
    }
    app.addFriend;
  });
  $(document).on('click', '.submit', app.handleSubmit);
  $(document).on('change', 'select', function() {
    if ($('select option:selected').val() === 'other') {
      $('.dropDownMenu').after('<form>Roomname:<br><input class="roomInput" type="text"></input></form>');
    } else {
      app.fetch($('select option:selected').val());
    }
  });
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

app.fetch = function (filter) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: JSON.stringify(),
    contentType: 'application/json',
    success: function (data) {
      app.clearAll();
      $('.dropDownMenu').append('<option value="other">Other...</option>');
      var roomNameStorage = {};
      for (var i = 0; i < data.results.length; i++) {
        var tempObject = _stringFilter(data.results[i]);
        app.addMessage(tempObject, filter);
        if (!roomNameStorage[tempObject.roomname]) {
          $('.dropDownMenu').prepend('<option value=' + tempObject.roomname.toLowerCase() + '>' + tempObject.roomname + '</option>');
          roomNameStorage[tempObject.roomname] = true;
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
      if (tempUsername[i] === '<' || tempUsername[i] === '(' || tempUsername[i] === ' ') {
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
      if (tempRoom[i] === '<' || tempRoom[i] === '(' || tempRoom[i] === ' ') {
        tempRoom[i] = '_';
      }
    }
    temp.roomname = tempRoom.join('');    
  } else {
    temp.roomname = 'empty_room';
  }

  return temp;
};

app.clearAll = function() {
  $('#chats').empty();
  $('.dropDownMenu').empty();
};

app.addMessage = function (message, filter) {
  if (!filter) {
    $('#chats').prepend('<div class="' + message.username + ' ' + message.roomname + '">' + message.username + ': <span>' + message.text + '</span>' + ' </div>');
  } else {
    if (message.roomname === filter) {
      $('#chats').append('<div class="' + message.username + ' ' + message.roomname + '">' + message.username + ': <span>' + message.text + '</span>' + ' </div>');
    }
  }
};

app.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');
};

app.addFriend = function() {
  console.log('clicked');
};

app.handleSubmit = function() {
  var roomInputName;
  if ($('select option:selected').val() === 'other') {
    roomInputName = $('.roomInput').val();
  } else {
    roomInputName = $('select option:selected').val();
  }

  var message = {
    username: decodeURIComponent(document.location.search.split('=')[1]),
    text: $('.messageInput').val(),
    roomname: roomInputName
  };
  app.send(message);
  $('.messageInput').val('');
  $('.roomInput').val('');
};

setInterval(app.fetch, 10000);

app.init();

app.fetch();

