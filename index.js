var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

var port = 8080;
var rootPath = path.join(__dirname, './');
var indexPath =  path.join(rootPath, 'views/index.html');

app.set('indexHTMLPath', indexPath);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, './browser')));
app.use(express.static(path.join(__dirname, './assets')));
app.use(express.static(path.join(__dirname, './public')));


app.get('/*', function (req, res, next) {
  res.sendFile(app.get('indexHTMLPath'));
});

app.listen(port, console.log('avengers on port', port));