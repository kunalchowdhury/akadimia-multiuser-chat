var fs = require('fs');
var https = require('https');
var cluster = require("cluster")
var numCPUs = require("os").cpus().length
var RedisStore = require("socket.io/lib/stores/redis")

var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())

var redisConfig = {
    host: 'localhost',
    port: 6379
}

const redis = require('socket.io-redis');
const emitter = require('socket.io-emitter')(redisConfig);

pub = redis.createClient()
sub = redis.createClient()
client = redis.createClient()

var options = {
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')

};

var serverPort = process.env.PORT;

var server = https.createServer(options, app);
var io = require('socket.io')(server);
//io.adapter(redis(redisConfig));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    console.log('res - '+res.worker)
});

const sticky = require('sticky-session');
if (!sticky.listen(server, serverPort)) {
    // Master code
    server.once('listening', function() {
        console.log('server started on %s port', serverPort);
        console.log(`Server running on ${process.env.PORT} port, PID: ${process.pid}`);

    });
} else {
    console.log('server started on %s port CHILD', serverPort);
}

io.on('connection', function(socket){
    console.log(`${socket.id} connected `);
    let message = socket.handshake.headers.referer;
    let user = message.split("?")[1].split("=")[1]
    //   console.log(user === '123');

    socket.emit('whoami', user);

    socket.on('chat message', function(msg){
        //io.emit('chat message', msg);

        emitter.emit('chat message', msg);
    });

    if(user === '123') {
        /*socket.on('chat message', function(msg){
            //io.emit('chat message', msg);

            console.log("GOT MESSG "+msg);
            emitter.emit('chat message', msg);
        });*/

        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
            socket.broadcast.emit('voice123', blob);
            //emitter.emit('voice123', blob);
        });
    }

    if(user === '345') {
        console.log('got message from 345');
        socket.on('radio', function (blob) {

            // can choose to broadcast it to whoever you want
            socket.broadcast.emit('voice345', blob);
            //emitter.emit('voice345', blob);
        });
    }

    if(user === '567') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
            socket.broadcast.emit('voice567', blob);
            //emitter.emit('voice567', blob);
        });
    }

    if(user === '789') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
            //socket.broadcast.emit('voice789', blob);
            emitter.emit('voice789', blob);
        });
    }

    if(user === '001') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
            //socket.broadcast.emit('voice001', blob);
            emitter.emit('voice001', blob);
        });
    }

});




/*
var server = require('http').createServer(function(req, res) {
    res.end('worker: ' + cluster.worker.id);
});

var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('got smthng incoming') ;
});



if (!sticky.listen(server, 5000)) {
    // Master code
    server.once('listening', function() {
        console.log('server started on 5000 port');
    });
} else {
    console.log('server started on 5000 port CHILD');
}
*/






