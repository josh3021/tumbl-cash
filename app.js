var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var passport = require('passport');
var engine = require('ejs-locals');

var config = require('./config');


app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(
  {
    secret: 'my key',
    resave: false,
  }
))

app.use(passport.initialize())
app.use(passport.session())

const database = require('./database/database')
database.init(app)

//routes
for(var i=0; i<config.passport.length; i++) {
  console.log(config.passport[i])
  require(config.passport[i])(app, passport)
}

for(var i=0; i<config.routes.length; i++) {
  console.log(config.routes[i])
  require(config.routes[i])(app)
}

const errorHandler = expressErrorHandler({
  static: {
    '404': './public/html/404.html'
  }
});

app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

http.listen(config.dev_port, () => {
  console.log('listening on http port: ' + config.dev_port)
})