// connection_str
// 123=Kunal Chowdhury;345=Watson Crick;567=Sherlock Holmes;789=Ireena Dutta;001=A Saha;002=Basant Banerjee;003=A Hazarika;004=John Wang;005=Mike Lee;006=Sher Singh;0000=Jack Dawson
//firewall-cmd --zone=public --add-port=30001/tcp --permanent
//firewall-cmd --zone=public --add-port=30002/tcp --permanent
//firewall-cmd --zone=public --add-port=30003/tcp --permanent
//firewall-cmd --zone=public --add-port=30004/tcp --permanent
//firewall-cmd --zone=public --add-port=30005/tcp --permanent
//firewall-cmd --zone=public --add-port=30006/tcp --permanent

var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())

var redisConfig = {
    host: 'localhost',
    port: 6379
}

const nodeRedis = require("redis");
const nodeClient = nodeRedis.createClient('6379', '127.0.0.1',{no_ready_check: true});
let connStr = '';

const redis = require('socket.io-redis');
const nodeClient1 = nodeRedis.createClient();

const emitter = require('socket.io-emitter')(redisConfig);

var options = {
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')

};

var serverPort = process.env.PORT;

var server = https.createServer(options, app);
var io = require('socket.io')(server);
//io.adapter(redis(redisConfig));
const redisAdapter = require('socket.io-redis');
//io.adapter(redisAdapter({ host: '127.0.0.1', port: 6379 }));


const Redis = require('ioredis');

const startupNodes = [
    {
        port: 30001,
        host: '127.0.0.1'
    },
    {
        port: 30002,
        host: '127.0.0.1'
    },
    {
        port: 30003,
        host: '127.0.0.1'
    },
    {
        port: 30004,
        host: '127.0.0.1'
    },
    {
        port: 30005,
        host: '127.0.0.1'
    },
    {
        port: 30006,
        host: '127.0.0.1'
    }

];

io.adapter(redisAdapter({
    pubClient: new Redis.Cluster(startupNodes),
    subClient: new Redis.Cluster(startupNodes)
}));
io.set('origins', '*:*');

app.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'TRUE');
// Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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
    console.log(user === '123');

    //emitter.emit('connect123', 'Connected');
    socket.emit('whoami', user);

    socket.on('sendconnstr', function(msg){
        nodeClient1.get("connection_str", function(err, reply) {
            // reply is null when the key is missing
            console.log(err);
            io.emit('connstr', reply);
        });});

    socket.on('chat message', function(msg){
        //io.emit('chat message', msg);

        io.emit('chat message', user+' > '+msg);
    });

    socket.on('videoff', function(msg){
        io.emit('pausevideo', msg);
    });
    socket.on('videoon', function(msg){
        io.emit('playvideo', msg);
    });
    socket.on('onlyaudio', function(msg){
        io.emit('audiocodec', msg);
    });

    socket.join('voice'+user) ;
    console.log('joined- voice'+user);
    if(user === '123') {
        socket.on('radio123', function (blob) {
            // can choose to broadcast it to whoever you want
          //  socket.broadcast.emit('voice123', blob);
         //   io.emit('voice123', blob);
            console.log('emitting to voice001');
            io.sockets.in('voice001').emit(blob);
        });
    }

    if(user === '345') {
        console.log('got message from 345');
        socket.on('radio', function (blob) {

            // can choose to broadcast it to whoever you want
          //  socket.broadcast.emit('voice345', blob);
            io.emit('voice345', blob);
        });
    }

    if(user === '567') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
         // socket.broadcast.emit('voice567', blob);
            io.emit('voice567', blob);
        });
    }

    if(user === '789') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice789', blob);
            io.emit('voice789', blob);
        });
    }

    if(user === '001') {
        socket.on('radio001', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
           // io.emit('voice001', blob);
            console.log('emitting to voice123');
            io.sockets.in('voice123').emit(blob);
        });
    }

    if(user === '002') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
            io.emit('voice002', blob);
        });
    }

    if(user === '003') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
            io.emit('voice003', blob);
        });
    }

    if(user === '004') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
            io.emit('voice004', blob);
        });
    }

    if(user === '005') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
            io.emit('voice005', blob);
        });
    }

    if(user === '006') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
          //  socket.broadcast.emit('voice001', blob);
            io.emit('voice006', blob);
        });
    }

    if(user === '0000') {
        socket.on('radio', function (blob) {
            // can choose to broadcast it to whoever you want
           // socket.broadcast.emit('voice001', blob);
            io.emit('voice0000', blob);
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







