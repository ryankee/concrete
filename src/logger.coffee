Logger = module.exports = (currentStream)->
    stream: currentStream ? ''
    log: (args) ->
        @stream += "#{args}\n"
