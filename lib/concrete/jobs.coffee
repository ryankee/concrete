mongo = require 'mongodb'
db = new mongo.Db 'concrete', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {auto_reconnect: true}), {}
db.open (error) ->
    console.log error if error?
ObjectID = mongo.BSONPure.ObjectID;

jobs = module.exports = 
    current: null
    addJob: (next)->
        db.collection 'jobs', (error, collection) ->
            collection.insert
                addedTime: new Date().getTime()
                log: ''
                running: no
                finished: no
            next() if next?

    getQueued: (next)->
        getJobs {running: no}, next

    getRunning: (next)->
        getJobs {running: yes}, next

    getAll: (next)->
        getJobs null, next

    get: (id, next) ->
        db.collection 'jobs', (error, collection) ->
            collection.findOne {_id: new ObjectID id}, (error, job) ->
                if job?
                    next job
                else
                    next "No job found with the id '#{id}'"

    clear: (next)->
        db.dropCollection 'jobs', (error) ->
            next() if next?
                
    getLog: (id, next)->
        db.collection 'jobs', (error, collection) ->
            collection.findOne {_id: new ObjectID id}, (error, job) ->
                if job?
                    next job.log
                else
                    next "No job found with the id '#{id}'"
    
    updateLog: (id, string, next)->
        db.collection 'jobs', (error, collection) ->
            collection.findOne {_id: new ObjectID id}, (error, job) ->
                console.log "update log for job #{job}, #{string}"
                return no if not job?
                job.log += "#{string} \n"
                collection.save(job)
                next() if next?
                    
    currentComplete: (success, next)->
        db.collection 'jobs', (error, collection) ->
            collection.findOne {_id: new ObjectID jobs.current}, (error, job) ->
                return no if not job?
                job.running = no
                job.finished = yes
                job.failed = not success
                job.finishedTime = new Date().getTime()
                jobs.current = null
                collection.save(job)
                next()

    next: (next)->
        db.collection 'jobs', (error, collection) ->
            collection.findOne {running: no, finished: no}, (error, job) ->
                return no if not job?
                job.running = yes
                job.startedTime = new Date().getTime()
                jobs.current = job._id.toString()
                collection.save(job)
                next()

getJobs = (filter, next)->
    db.collection 'jobs', (error, collection) ->
        if filter?
            collection.find(filter).toArray (error, results) ->
                next results
        else
            collection.find().toArray (error, results) ->
                next results
