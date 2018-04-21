var Client = {};
Client.socket = io.connect('http://138.68.131.76');

Client.askNewPlayer = function(){
    let username = getParameterByName('username');
    Interstellar.playerUsername = username;
    Client.socket.emit('newplayer', username);
};

Client.socket.on('newplayer',function(data){
    Interstellar.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('remove',function(id){
    Interstellar.removePlayer(id);
});

Client.sendCoord = (x, y) => {
  Client.socket.emit('coord',{x:x,y:y});
};

Client.socket.on('allplayers',function(data){
    // console.log(data);
    for(var i = 0; i < data.length; i++){
        Interstellar.addNewPlayer(data[i].id, data[i].username, data[i].x, data[i].y);
    }
});

Client.disconnect = () {
  Client.socket.emit('disconnect');
};

Client.socket.on('move',function(data){
    Interstellar.movePlayer(data.id, data.x, data.y);
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
