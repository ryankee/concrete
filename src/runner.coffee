# cli colors
colors = require 'colors'
git = require './git'
server = require './server'
exec = require('child_process').exec
mongo = require 'mongodb'
jobs = require './jobs'


parseSequence = (input) ->
  length = input.length
  return { cmd: input[length - 1], args: input.substring 2, length - 1 }

tokenize = (input, result = []) ->
  return [''] if input == ''

  input.replace /(\u001B\[.*?([@-~]))|([^\u001B]+)/g, (m) ->
    result.push m[0] == '\u001B' and parseSequence(m) or m

  return result


COLORS =
  0: '', 1: 'bold', 4: 'underscore', 5: 'blink',
  30: 'fg-black', 31: 'fg-red', 32: 'fg-green', 33: 'fg-yellow',
  34: 'fg-blue', 35: 'fg-magenta', 36: 'fg-cyan', 37: 'fg-white'
  40: 'bg-black', 41: 'bg-red', 42: 'bg-green', 43: 'bg-yellow',
  44: 'bg-blue', 45: 'bg-magenta', 46: 'bg-cyan', 47: 'bg-white'

html = (input) ->
  result = input.map (v) ->
    if typeof v == 'string'
      return v
    else if v.cmd == 'm'
      cls = v.args.split(';').map((v) -> COLORS[parseInt v]).join(' ')
      return "</span><span class=\"#{cls}\">"
    else
      return ''

  return "<code><pre><span>#{result.join('')}</span></pre></code>"


runner = module.exports =
    build: ->
        runNextJob()

runNextJob = ->
    return no if jobs.current?
    jobs.next ->
        git.pull ->
            runTask (success)->
                jobs.currentComplete success, ->
                    runNextJob()

runTask = (next)->
    jobs.updateLog jobs.current, "Executing '#{git.runner}'"
    exec git.runner,{maxBuffer: 1024*1024}, (error, stdout, stderr)=>
        if error?
            updateLog error, true, ->
                updateLog stdout, true, ->
                    updateLog stderr, true, ->
                        runFile git.failure, next, no
        else
            updateLog stdout, true, ->
                runFile git.success, next, yes

runFile = (file, next, args=null) ->
    jobs.updateLog jobs.current, "Executing #{file}", ->
        console.log "Executing #{file}".grey
        exec file, (error, stdout, stderr)=>
            if error?
                updateLog error, true, ->
                    updateLog stdout, true, ->
                        updateLog stderr, true, ->
                            next(args)
            else
                updateLog stdout, true, ->
                    next(args)

updateLog = (buffer, isError, done) ->
    content = html tokenize buffer.toString()
    if isError
        errorClass = ' error'
        console.log "#{content}".red
    else
        errorClass = ''
        console.log content
    jobs.updateLog jobs.current, "<span class='output#{errorClass}'>#{content}</span>", done
