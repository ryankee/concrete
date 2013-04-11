module.exports = (function(){
  var express = require('express'),
      app = express(),
      assets = require('connect-assets'),
      http = require('http'),
      livereload = require('express-livereload'),
      server;
  
  if(app.get('env') === 'development'){
    livereload(app, {
      watchDir:process.cwd() + "/app"
    });
  }

  // configure assets
  app.use(assets({
    src:'app/client'
  }));
  css.root = 'styles';
  js.root  = '';
  
  // other statics
  app.use(express.static('app/client'));
  
  // point to lib for views
  app.settings.views = __dirname + '/views';
  
  // set ejs engine
  app.engine('html', require('ejs').renderFile);
  
  app.get('/', function(req, res){
    res.render('index.html', {
      env:app.get('env')
    });
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
