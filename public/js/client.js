var Client = {};
function createClient(){
  Client.socket = io.connect('http://138.68.131.76');
  // Client.socket = io.connect();

  Client.askNewPlayer = function(){
      let username = getParameterByName('username');
      Interstellar.playerUsername = username;
      Client.socket.emit('newplayer', username);
  };

  Client.socket.on('newplayer',function(data){
      console.log("New Player Data: "+data.id+" "+data.username+" "+data.x+" "+data.y);
      Interstellar.addNewPlayer(data.id,data.x,data.y);
  });

  Client.socket.on('remove',function(id){
      Interstellar.removePlayer(id);
  });

  Client.sendCoord = (x, y) => {
    // console.log("Coording: "+x+" "+y);
    Client.socket.emit('coord',{dataX:x,dataY:y});
  };

  Client.socket.on('allplayers',function(data){
      for(var i = 0; i < data.length; i++){
        console.log("All Player Data: "+data[i].id+" "+data[i].username+" "+data[i].x+" "+data[i].y);
          Interstellar.addNewPlayer(data[i].id, data[i].username, data[i].x, data[i].y);
      }
  });

  Client.disconnect = () => {
    Client.socket.emit('disconnect');
  };

  Client.socket.on('move',function(data){
    console.log("Moving: "+data.id+" "+data.username+" "+data.x+" "+data.y);
       Interstellar.movePlayer(data.id, data.x, data.y);
  });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
