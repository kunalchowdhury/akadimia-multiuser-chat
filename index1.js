var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())


var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};
var serverPort = 3000;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index_ORIG.html');
});


server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
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
        console.log('got message from 345');
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

