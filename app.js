const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('document.html');
});




app.listen(3000, function() {
  console.log('app listening on port 3000');
});
