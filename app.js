const express = require("express");
const mustache = require("mustache-express");
const mongoose = require("mongoose");
const bluebird = require ("bluebird");
const bodyparser = require("body-parser");
const session = require("express-session");
const User = require('./user.schema');
const Snippets = require('./snippets.schema');

//Configure server
const server = express();

//Body-parser and express-session
server.use(bodyparser.urlencoded({ extended: false }));
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//Configure mustache
server.engine("mustache", mustache());
server.set("views", "./views");
server.set("view engine", "mustache");

//connect to database
mongoose.connect('mongodb://localhost:27017/snippets');
mongoose.Promise = bluebird;

//Sign in and sign up
// User.create ({
//   username: 'a',
//   password: 'a',
// });

// Snippets.create ({
//   title: 'Snippet',
//   code: 'hi',
//   notes: 'this is a snippet',
//   language: 'HTML',
//   tags: 'no',
// });

//Get request for sign in
server.get("/", function (req, res) {
  res.render("login");
});

//Post request for login & create variable for the session
server.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

let user = null;
User.find().then(function (person) {
  for (let i = 0; i < person.length; i++){

  if (person[i].username === username &&
      person[i].password === password){
      user = person[i].username;
    }
  }
//User info is a match, set up session
  if (user !== null){
      req.session.who = user;
      res.redirect('/snippets');
  } else {
      res.redirect('/main');
    }
  });
});

//Get request for sign up
server.get('/register', function (req, res) {
  res.render('signup');
});

//Get request for home nav link
server.get('/home', function (req, res) {
  res.render('main');
});

//Post request for sign up
server.post('/register', function (req, res) {
  User.create ({
    name: req.body.username,
    password: req.body.password,
  });
});

//Get request for main page
server.get('/main', function(req, res){
  Snippets.find().then(function (snippets) {
      res.render('main', {
        snippets: snippets,
    });
  });
});

server.get('/display/:snippet_id', function (req, res) {
  const id =  req.params.snippet_id; // the underscore is mongo specific
  Snippets.findOne({
      _id: id
  }).then(function (result) {
  res.render('snippets', {
    snippet: result, 
    });
  });
});

//Get route for add snippet
server.get('/add', function (req, res) {
  res.render('add');
});

//Post request for form
server.post('/add', function (req, res) {
      Snippets.create ({
        title: req.body.title,
        code: req.body.code,
        notes: req.body.notes,
        language: req.body.language,
        tags: req.body.tags,
    });
  res.redirect('/main');
});

//Post request for search
server.post('/search', function (req, res) {
  if (req.body.select === 'language') {
    Snippets.find ({
    language: req.body.searchKey
      }).then(function (snippets) {
          res.render('main', {
            snippets: snippets,
        });
      });
    }

  if (req.body.select === 'tags'){
    Snippets.find({
    tags: req.body.searchKey
      }).then(function (snippets) {
        res.render('main', {
          snippets: snippets,
      });
    });
  }
});

// start server
server.listen(5000, function () {
  console.log("yeet");
});