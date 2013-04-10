var exec = require('child_process').exec;

describe('Server', function() {
  var server;
  beforeEach(function() {
    server = require('../app/server/server');
  });

  it('can be imported', function() {
    expect(server).toBeDefined();
  });
  
  it('has a start method', function() {
    expect(server.start).toBeDefined();
  });

  it('can start', function(done) {
    var port = 4567,
        host = 'localhost';
    server.start(port, host);
    exec('curl -I http://'+host+':'+port+'/', function(err, stdout){
      expect(stdout).toMatch(/200 OK/i);
      server.stop();
      done();
    });
  });
  
  it('can be closed', function() {
    expect(function(){
      server.start();
      server.stop();
    }).not.toThrow();
  });

});
