var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// middleware
io.use((socket, next) => {
  let token = socket.handshake.query.user;
  return next();
});

io.on('connection', function(socket){
  let message = socket.handshake.headers.referer;
  let user = message.split("?")[1].split("=")[1]
  console.log(user === '123');

  socket.emit('whoami', user);

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  if(user === '123') {
    socket.on('radio', function (blob) {
      // can choose to broadcast it to whoever you want
      socket.broadcast.emit('voice123', blob);
    });
  }

  if(user === '345') {
    socket.on('radio', function (blob) {
      // can choose to broadcast it to whoever you want
      socket.broadcast.emit('voice345', blob);
    });
  }

  if(user === '567') {
    socket.on('radio', function (blob) {
      // can choose to broadcast it to whoever you want
      socket.broadcast.emit('voice567', blob);
    });
  }

  if(user === '789') {
    socket.on('radio', function (blob) {
      // can choose to broadcast it to whoever you want
      socket.broadcast.emit('voice789', blob);
    });
  }

  if(user === '001') {
    socket.on('radio', function (blob) {
      // can choose to broadcast it to whoever you want
      socket.broadcast.emit('voice001', blob);
    });
  }

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});
