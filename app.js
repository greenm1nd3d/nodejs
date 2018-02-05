var express = require('express');
var body_parser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('workflow', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg  : msg,
      value: value
    };
  }
}));

app.get('/', function(req, res) {
  db.users.find(function(err, docs) {
    res.render('index', {
      title: 'Workflow',
      users: docs
    });
  });
});

app.post('/users/add', function(req, res) {
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('email_address', 'Email address is required').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.render('index', {
      title: 'Workflow',
      users: users,
      errors: errors
    });
    console.log('ERROR');
  } else {
    var new_user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email_address
    }

    db.users.insert(new_user, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  }
});

app.delete('/users/delete/:id', function(req, res) {
  db.users.remove({"_id": ObjectId(req.params.id)}, function(err, result) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, function() {
  console.log('Server started on port 3000...');
})
