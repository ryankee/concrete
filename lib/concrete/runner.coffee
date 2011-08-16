# cli colors
colors = require 'colors'
git = require './git'
server = require './server'
exec = require('child_process').exec
mongo = require 'mongodb'
jobs = require './jobs'

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
    exec git.runner, (error, stdout, stderr)=>
        if error?
            err = error.toString()
            jobs.updateLog jobs.current, "<span class='output error'>#{err}</span>", ->
                console.log "#{err}".red
                runFile git.failure, next, no
        else
            out = stdout.toString()
            jobs.updateLog jobs.current, "<span class='output'>#{out}</span>", ->
                console.log out
                runFile git.success, next, yes

runFile = (file, next, args=null) ->
    jobs.updateLog jobs.current, "Executing #{file}", ->
        console.log "Executing #{file}".grey
        exec file, (error, stdout, stderr)=>
            if error?
                err = error.toString()
                jobs.updateLog jobs.current, "<span class='output error'>#{err}</span>", ->
                    next(args)
                    console.log "#{err}".red
            else
                out = stdout.toString()
                jobs.updateLog jobs.current, "<span class='output'>#{out}</span>", ->
                    next(args)
                    console.log out
