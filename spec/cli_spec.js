var exec = require('child_process').exec;

describe('Command line interface', function() {
  var cmd =  '"' + process.execPath + '"' +  ' ./bin/concrete ',
      options = {timeout: 1000};
  
  it('shows help', function(done){
    exec(cmd + ' --help', options, function(err, stdout){
      expect(stdout).toMatch(/Usage: concrete/i);
      done();
    });
  });

  it('uses default host', function(done){
    exec(cmd, options, function(err, stdout){
      expect(stdout).toMatch(/0\.0\.0\.0/i);
      done();
    });
  });

  it('uses default port', function(done){
    exec(cmd, options, function(err, stdout){
      expect(stdout).toMatch(/:4567/i);
      done();
    });
  });

  it('uses specified host', function(done){
    exec(cmd + '-h localhost', options, function(err, stdout){
      expect(stdout).toMatch(/localhost/i);
      done();
    });
  });

  it('uses default port', function(done){
    exec(cmd + '-p 1234', options, function(err, stdout){
      expect(stdout).toMatch(/1234/);
      done();
    });
  });
});
