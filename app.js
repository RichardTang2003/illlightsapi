const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');
const ejs = require('ejs');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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
  
});

//Words Page
const wordSchema =new mongoose.Schema({
  content: String
});
const Word = mongoose.model('word', wordSchema);

app.get('/words', function(req, res) {
  Word.aggregate([ { $sample: { size: 3 } } ]).exec(function(err, result) {
    if (err){
      console.log(err);
      res.send('内部错误，请重试或联系管理员');
    } else{
      res.render('word', {
        word1: result[0].content,
        word2: result[1].content,
        word3: result[2].content
      });
    }
  });
});

app.post('/words/add', function(req, res) {
  if (req.body.addpasswd == 'qq2030807246'){
    const newWord = new Word({
      content: req.body.addword
    });
    newWord.save();
    res.redirect('/words');
  } else {
    res.send('密码错误');
  }
});

app.post('/words/remove', function(req, res) {
  if (req.body.removepasswd == 'qq2030807246'){
    Word.deleteMany({content: req.body.removeword}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect('/words');
  } else {
    res.send('密码错误');
  }
});

// Document Page
app.get('/', function(req, res) {
  Saying.aggregate([ { $sample: { size: 1 } } ]).exec(function(err, result) {
    const sayingsContent = result[0].content;
    let sayingsAuthor = result[0].author;
    if (sayingsAuthor == undefined) {
      sayingsAuthor = 'unkown';
    }


    Saying.countDocuments({}, function (err, sayingsCount) {
      res.render('document', {
        sayingsCount: sayingsCount,
        sayingsContent: sayingsContent,
        sayingsAuthor: sayingsAuthor
      });
    });
  });
});




app.listen(3000, function() {
  console.log('app listening on port 3000');
});
