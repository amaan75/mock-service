var createError = require('http-errors');
var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var fs = require("fs");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mockController = require("./routes/mock-controller")

// var indexRouter = require('./routes/index');

var app = express();

const args = process.argv;
const pathToConfig = path.resolve(args[2]);
console.log("path to config" + pathToConfig);
const config = fs.readFileSync(pathToConfig, { encoding: "UTF-8" });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mockController(app, config);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
