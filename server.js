let fs = require('fs');
let https = require('https');

let express = require('express');
let app = express();
let cors = require('cors')
app.use(cors())

let options = {
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')

};

let server = https.createServer(options, app);
let io = require('socket.io')(server);
io.set('origins', '*:*');

app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'TRUE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.sendFile(__dirname + '/index_webrtc.html');
    console.log('res - ' + res.worker)
});
var serverPort = process.env.PORT;

const sticky = require('sticky-session');
if (!sticky.listen(server, 5000)) {
    // Master code
    server.once('listening', function() {
        console.log('server started on %s port', serverPort);
        console.log(`Server running on ${process.env.PORT} port, PID: ${process.pid}`);

    });
}

console.log('Lisening at port 5000')

let sockets = []
io.on('connection', function (socket) {
        socket.emit('add-users', {
            users: sockets
        });
        socket.broadcast.emit(
            'add-users', {
                users: [socket.id]
        });
        socket.on('make-offer', function (data){
            socket.to(data.to).emit('offer-made',{
                offer: data.offer,
                socket: socket.id
            });
        });
        socket.on(
         'make-answer', function (data){
             socket.to(data.to).emit('answer-made', {
                socket : socket.id,
                answer : data.answer
             });
            }
        );
        socket.on('disconnect', function(){
            sockets.splice(sockets.indexOf(socket.id),1);
            io.emit('remove-user', socket.id);
        });

        sockets.push(socket.id);
    }
);