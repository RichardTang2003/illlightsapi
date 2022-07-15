const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect DB


// Random Saying Page
const sayingSchema = new mongoose.Schema({
  _id: Number,
  content: String,
  author: String,
  from: String,
  type: String
});
const Saying = mongoose.model("saying", sayingSchema);

app.get('/saying', function(req, res){
  Saying.aggregate([ { $sample: { size: 1 } } ]).exec(function(err, result) {
    if (err){
      console.log(err);
      res.send('内部错误，请重试或联系管理员');
    } else{
      res.send(result);
    }
  });
});

app.get('/saying/:language', function(req, res) {
  const params ={
    language: req.params.language,
    search: req.query.search,
    type: req.query.type,
    author: req.query.author,
    from: req.query.from
  };

  if (params.language === 'zh') {
    Saying.aggregate([ {$match: {language: {$exists: 0}}}, { $sample: { size: 1 } } ]).exec(function(err, result) {
      if (err){
        console.log(err);
        res.send('内部错误，请重试或联系管理员');
      } else{
        if (JSON.stringify(result) == "[]") {
          res.send('查询无结果');
        } else { res.send(result); }
      }
    });
  } else {
    Saying.aggregate([ {$match: {language: params.language}}, { $sample: { size: 1 } } ]).exec(function(err, result) {
      if (err){
        console.log(err);
        res.send('内部错误，请重试或联系管理员');
      } else{
        if (JSON.stringify(result) == "[]") {
          res.send('查询无结果');
        } else { res.send(result); }
      }
    });
  }
});



// Document Page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/document.html');
});




app.listen(3000, function() {
  console.log('app listening on port 3000');
});
