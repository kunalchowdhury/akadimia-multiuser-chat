//Client ID  0oaps5l0b4ih2oqV54x6
//Client secret JclHxrVNo3aI1wMbD-rIMti7-6D2mIMp-VhkzmMR
// Token name : akadimia-login
// Token : 00QnWqSlb6MKt1qXfAaVqQ3B3WcH9n4twsNsRadNOI
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require("express-session");

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboardRouter);
app.use('/users', publicRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'akdkajkejkrejkasjdlkjkr4w9l',
  resave: true,
  saveUninitialized: false
}))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
