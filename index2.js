// connection_str
// 123=Kunal Chowdhury;345=Watson Crick;567=Sherlock Holmes;789=Ireena Dutta;001=A Saha;002=Basant Banerjee;003=A Hazarika;004=John Wang;005=Mike Lee;006=Sher Singh;0000=Jack Dawson
//firewall-cmd --zone=public --add-port=30001/tcp --permanent
//firewall-cmd --zone=public --add-port=30002/tcp --permanent
//firewall-cmd --zone=public --add-port=30003/tcp --permanent
//firewall-cmd --zone=public --add-port=30004/tcp --permanent
//firewall-cmd --zone=public --add-port=30005/tcp --permanent
//firewall-cmd --zone=public --add-port=30006/tcp --permanent

/*
*
*  proxy_set_header   X-Forwarded-For $remote_addr;
           proxy_set_header   Host $http_host;
           proxy_http_version 1.1;
           proxy_set_header   Upgrade $http_upgrade;
           proxy_set_header   Connection "upgrade";
* */


let fs = require('fs');
let https = require('https');

let express = require('express');
let app = express();
let cors = require('cors')
app.use(cors())


const nodeRedis = require("redis");
const nodeClient1 = nodeRedis.createClient();

let options = {
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')

};

let serverPort = process.env.PORT;

let server = https.createServer(options, app);
let io = require('socket.io')(server);

const redisAdapter = require('socket.io-redis');


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

    res.sendFile(__dirname + '/index_ORIG.html');
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

    io.on('connection', function (socket) {
        let user;
        try {
            console.log(`${socket.id} connected `);
            let message = socket.handshake.headers.referer;
            user = message.split("?")[1].split("=")[1]
            socket.emit('whoami', user);
        }catch (e) {
            console.error(e);
        }

        socket.on('sendconnstr', function (msg) {
            nodeClient1.get("connection_str", function (err, reply) {
                // reply is null when the key is missing
                console.log(err);
                io.emit('connstr', reply);
            });
        });

        socket.on('chat message', function (msg) {
            console.log("chat message "+user+" > "+msg);
            io.emit('chat message', user + ' > ' + msg);
        });
        socket.on('peerinfo', function (msg){
            try {
                console.log(" ----  >>>>>>>>>>>>>>>>>>>>> " + (!global.allPeers));
                if (global.allPeers) {
                    let gconns = global.allPeers.split(",");
                    let x = "|";
                    for (let i = 0; i < gconns.length; i++) {
                        if (gconns[i].split("-")[0] !== msg.split("-")[0]) {
                            x = x + "," + gconns[i];
                        }
                    }
                    global.allPeers = x + "," + msg;
                    global.allPeers = global.allPeers.replace("|,", "");
                } else {
                    global.allPeers = global.allPeers + "," + msg;
                    global.allPeers = global.allPeers.replace("undefined,", "");
                    console.log("   1st " + global.allPeers);

                }
                console.log(global.allPeers);
                io.emit('newpeer', global.allPeers);
            }catch (e) {
                console.error(e);
            }
        });

        socket.on('peerinfoscreen', function (msg){
            try {
                console.log(" ----  >>>>>>>>>>>>>>>>>>>>> " + (!global.allPeers));
                if (global.allPeersScreen) {
                    let gconnsScreen = global.allPeersScreen.split(",");
                    let x = "|";
                    for (let i = 0; i < gconnsScreen.length; i++) {
                        if (gconnsScreen[i].split("-")[0] !== msg.split("-")[0]) {
                            x = x + "," + gconnsScreen[i];
                        }
                    }
                    global.allPeersScreen = x + "," + msg;
                    global.allPeersScreen = global.allPeersScreen.replace("|,", "");
                } else {
                    global.allPeersScreen = global.allPeersScreen + "," + msg;
                    global.allPeersScreen = global.allPeersScreen.replace("undefined,", "");
                    console.log("   1st > " + global.allPeersScreen);

                }
                console.log(global.allPeersScreen);
                io.emit('newpeerscreen', global.allPeersScreen);
            }catch (e) {
                console.error(e);
            }

        });

        socket.on('alloff', function (msg) {
            io.emit('pausevideo', msg);
        });
        socket.on('videoon', function (msg) {
            io.emit('playvideo', msg);
        });
        socket.on('onlyaudio', function (msg) {
            io.emit('audiocodec', msg);
        });

        socket.on('vid001', function (msg){
            io.emit('v001', msg);
        });

        socket.on('mutevid', function (msg){
            console.log('mutevid '+msg);
            io.emit('voff', msg);
        });

        socket.on('onvid', function (msg){
            io.emit('von', msg);
        });

        socket.on('muteaud', function (msg){
            console.log('mutevid '+msg);
            io.emit('aoff', msg);
        });

        socket.on('onaud', function (msg){
            io.emit('aon', msg);
        });

        socket.join('voice' + user);

        if (user === '123') {
            socket.on('radio123', function (blob) {
                io.to('voice001').emit('voice123', blob);
            });
        }

        if (user === '345') {
            console.log('got message from 345');
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice567').to('voice789')
                    .to('voice001').to('voice002').to('voice003')
                    .to('voice004').to('voice005').to('voice006')
                    .to('voice0000').emit('voice345', blob);
            });
        }

        if (user === '567') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice789')
                    .to('voice001').to('voice002').to('voice003')
                    .to('voice004').to('voice005').to('voice006')
                    .to('voice0000').emit('voice567', blob);
            });
        }

        if (user === '789') {
            socket.on('radio', function (blob) {
                // can choose to broadcast it to whoever you want
                // socket.broadcast.emit('voice789', blob);
                //  io.emit('voice789', blob);
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice001').to('voice002').to('voice003')
                    .to('voice004').to('voice005').to('voice006')
                    .to('voice0000').emit('voice789', blob);
            });
        }

        if (user === '001') {
            socket.on('radio001', function (blob) {
            io.to('voice123').emit('voice001', blob);
            });
        }

        if (user === '002') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice003')
                    .to('voice004').to('voice005').to('voice006')
                    .to('voice0000').emit('voice002', blob);
            });
        }

        if (user === '003') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice002')
                    .to('voice004').to('voice005').to('voice006')
                    .to('voice0000').emit('voice003', blob);
            });
        }

        if (user === '004') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice002')
                    .to('voice003').to('voice005').to('voice006')
                    .to('voice0000').emit('voice004', blob);
            });
        }

        if (user === '005') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice002')
                    .to('voice003').to('voice004').to('voice006')
                    .to('voice0000').emit('voice005', blob);
            });
        }

        if (user === '006') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice002')
                    .to('voice003').to('voice004').to('voice005')
                    .to('voice0000').emit('voice006', blob);
            });
        }

        if (user === '0000') {
            socket.on('radio', function (blob) {
                io.to('voice123').to('voice345').to('voice567')
                    .to('voice789').to('voice001').to('voice002')
                    .to('voice003').to('voice004').to('voice005')
                    .to('voice006').emit('voice0000', blob);
            });
        }

    });
}
