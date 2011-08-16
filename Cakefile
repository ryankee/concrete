{print}       = require 'sys'
{spawn} = require 'child_process'
task 'build', 'Compilie coffeescript files', (options)->
    options = ['-c', '-o', 'lib', 'src']
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', (data) -> print data.toString()
    coffee.stderr.on 'data', (data) -> print data.toString()
    coffee.on 'exit', (status) -> callback?() if status is 0