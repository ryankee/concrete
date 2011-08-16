express = require 'express'
stylus = require 'stylus'
fs = require 'fs'
path = require 'path'
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
    
    # This must be BEFORE other app.use
    app.use stylus.middleware
        debug: false
        src: __dirname + '/views'
        dest: __dirname + '/public'
        compile: (str)->
            stylus(str).set 'compress', true

    coffeeDir = __dirname + '/views'
    publicDir = __dirname + '/public'
    app.use express.compiler src: coffeeDir, dest: publicDir, enable: ['coffeescript']
    # app.use express.static publicDir
    
    app.use express.logger()
    # app.use express.bodyParser()
    # app.use express.methodOverride()
    # app.use express.cookieParser()
    # app.use express.session({secret:"concrete"})
    app.use app.router
    app.use express.static __dirname + '/public'    

app.configure 'development', ->
    app.use express.errorHandler dumpExceptions: on, showStack: on

app.configure 'production', ->
    app.use express.errorHandler dumpExceptions: on, showStack: on
    # app.use express.errorHandler()

app.get '/', (req, res) ->
    jobs.getAll (jobs)->
        res.render 'index',
            project: path.basename process.cwd()
            jobs: jobs

app.get '/jobs', (req, res) ->
    jobs.getAll (jobs)->
        res.json jobs

app.get '/job/:id', (req, res) ->
    jobs.get req.params.id, (job) ->
        res.json job

app.get '/job/:id/:attribute', (req, res) ->
    jobs.get req.params.id, (job) ->
        if job[req.params.attribute]?
            # if req.xhr...
            res.json job[req.params.attribute]
        else
            res.send "The job doesn't have the #{req.params.attribute} attribute"

app.get '/clear', (req, res) ->
    jobs.clear ->
        res.redirect '/jobs'

app.get '/add', (req, res) ->
    jobs.addJob ->
        res.redirect '/jobs'

app.post '/', (req, res) ->
    jobs.addJob (job)->
        runner.build()
        if req.xhr
            console.log job
            res.json job
        else
            res.redirect '/'