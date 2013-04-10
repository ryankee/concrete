describe('.concrete.js parser', function() {

  it('can parse concrete file', function() {
    var parser = require('../app/server/models/project_configuration')
                  .create(__dirname + '/../.concrete.js');
    expect(parser.config).toBeDefined();
  });
  
});
