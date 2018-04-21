const express = require('express'),
      path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html"));
app.use(express.static(__dirname + '/public'));

server.lastPlayderID = 0;

io.on('connection',function(socket){

    socket.on('newplayer',function(username){
        socket.player = {
            id: server.lastPlayderID++,
            username: username,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);

        socket.on('coord',function(data){
            // console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);

        });
    });

});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}



server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
