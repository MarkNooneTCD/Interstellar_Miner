const express = require('express'),
      path = require('path');
const app = express();

app.get('/', (req, res) => res.sendfile("./public/index.html"));

app.use(express.static(__dirname + '/public'));
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
