module.exports = (function(){
  var express = require('express'),
      app = express(),
      http = require('http'),
      server;
  
  app.get('/', function(req, res){
    res.send('concrete');
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
