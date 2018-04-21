const express = require('express'),
      path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html"));
app.use(express.static(__dirname + '/public'));

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
