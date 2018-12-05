var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');
var compression = require('compression');

var book = require('./routes/book');
var form = require('./routes/form');
var public = require('./routes/public');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://minja:mifi1990@ds127843.mlab.com:27843/toolkit', { promiseLibrary: require('bluebird'), useFindAndModify: false, useNewUrlParser: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

app.set('views', './views')
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(express.static('public'));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);
app.use('/form', form);
app.use('/public', public);
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3000);

module.exports = app;