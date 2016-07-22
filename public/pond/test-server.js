
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/', function(req, res){
	res.sendfile('index.html');
});

app.get('/manifest.webapp', function(req, res){
	res.header('Content-Type', 'application/x-web-app-manifest+json');
	res.sendfile('manifest.webapp');
});

app.get('/log', function(req, res){
  console.log(req.param('l'))
  res.end()
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
