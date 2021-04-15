var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var  users  = require('./user/users');
var auth = require('./utils/auth');

app.set('views', './views');
app.set('view engine', 'ejs');	

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var router = require('./router');
app.use('/', router);

const PORT = 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});


