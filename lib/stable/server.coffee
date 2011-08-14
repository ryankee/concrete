express = require 'express'
stylus = require 'stylus'
fs = require 'fs'
runner = require './runner'
jobs = require './jobs'
app = module.exports = express.createServer()

app.configure ->
    app.set 'views', __dirname + '/views'

    # use coffeekup for html markup
    app.set 'view engine', 'coffee'
    app.register '.coffee', require('coffeekup').adapters.express
    app.set 'view options', {
        layout: false
    }

    app.use express.logger()
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use express.cookieParser()
    app.use express.session({secret:"stable"})
    app.use app.router
    app.use express.static __dirname + '/public'    

app.configure 'development', ->
    app.use express.errorHandler dumpExceptions: on, showStack: on

app.configure 'production', ->
    app.use express.errorHandler dumpExceptions: on, showStack: on
    # app.use express.errorHandler()

app.get '/', (req, res) ->
    res.render 'index', title: 'Home!', max:12, path:req.url

app.get '/taco', (req, res) ->
    res.contentType 'json'
    res.send {header:req.header 'host'}

app.get '/jobs', (req, res) ->
    jobs.getAll (jobs)->
        res.send JSON.stringify jobs

app.get '/log/:id', (req, res) ->
    console.log req.params.id
    jobs.getLog req.params.id, (log)->
        res.send log

app.get '/clear', (req, res) ->
    jobs.clear ->
        res.redirect '/jobs'

app.get '/add', (req, res) ->
    jobs.addJob ->
        res.redirect '/jobs'

app.post '/', (req, res) ->
    runner.build()
    res.redirect '/jobs'