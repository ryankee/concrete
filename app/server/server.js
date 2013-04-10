module.exports = (function(){
  var express = require('express'),
      app = express(),
      http = require('http'),
      server;
  
  // point to lib for views
  app.settings.views = __dirname + '/views';
  
  // set ejs engine
  app.engine('html', require('ejs').renderFile);
  
  app.get('/', function(req, res){
    res.render('index.html');
  });

  return {
    start: function(port, host){
      server = http.createServer(app).listen(port, host);
    },
    stop: function(){
      server.close();
    }
  };
}());
