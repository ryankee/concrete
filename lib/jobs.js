(function() {
  var ObjectID, db, getJobs, jobs, mongo, path;
  mongo = require('mongodb');
  path = require('path');
  db = new mongo.Db("concrete_" + (path.basename(process.cwd())), new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {
    auto_reconnect: true
  }), {});
  db.open(function(error) {
    if (error) {
      console.log('There was an error creating a connection with the Mongo database. Please check that MongoDB is properly installed and running.'.red);
      return process.exit(1);
    }
  });
  ObjectID = mongo.BSONPure.ObjectID;
  jobs = module.exports = {
    current: null,
    addJob: function(next) {
      return db.collection('jobs', function(error, collection) {
        var job;
        job = {
          addedTime: new Date().getTime(),
          log: '',
          running: false,
          finished: false
        };
        collection.insert(job);
        if (next != null) {
          return next(job);
        }
      });
    },
    getQueued: function(next) {
      return getJobs({
        running: false
      }, next);
    },
    getRunning: function(next) {
      return getJobs({
        running: true
      }, next);
    },
    getAll: function(next) {
      return getJobs(null, next);
    },
    get: function(id, next) {
      return db.collection('jobs', function(error, collection) {
        return collection.findOne({
          _id: new ObjectID(id)
        }, function(error, job) {
          if (job != null) {
            return next(job);
          } else {
            return next("No job found with the id '" + id + "'");
          }
        });
      });
    },
    clear: function(next) {
      return db.dropCollection('jobs', function(error) {
        if (next != null) {
          return next();
        }
      });
    },
    getLog: function(id, next) {
      return db.collection('jobs', function(error, collection) {
        return collection.findOne({
          _id: new ObjectID(id)
        }, function(error, job) {
          if (job != null) {
            return next(job.log);
          } else {
            return next("No job found with the id '" + id + "'");
          }
        });
      });
    },
    updateLog: function(id, string, next) {
      return db.collection('jobs', function(error, collection) {
        return collection.findOne({
          _id: new ObjectID(id)
        }, function(error, job) {
          console.log("update log for job " + job + ", " + string);
          if (!(job != null)) {
            return false;
          }
          job.log += "" + string + " <br />";
          collection.save(job);
          if (next != null) {
            return next();
          }
        });
      });
    },
    currentComplete: function(success, next) {
      return db.collection('jobs', function(error, collection) {
        return collection.findOne({
          _id: new ObjectID(jobs.current)
        }, function(error, job) {
          if (!(job != null)) {
            return false;
          }
          job.running = false;
          job.finished = true;
          job.failed = !success;
          job.finishedTime = new Date().getTime();
          jobs.current = null;
          collection.save(job);
          return next();
        });
      });
    },
    next: function(next) {
      return db.collection('jobs', function(error, collection) {
        return collection.findOne({
          running: false,
          finished: false
        }, function(error, job) {
          if (!(job != null)) {
            return false;
          }
          job.running = true;
          job.startedTime = new Date().getTime();
          jobs.current = job._id.toString();
          collection.save(job);
          return next();
        });
      });
    }
  };
  getJobs = function(filter, next) {
    return db.collection('jobs', function(error, collection) {
      if (filter != null) {
        return collection.find(filter).toArray(function(error, results) {
          return next(results);
        });
      } else {
        return collection.find().toArray(function(error, results) {
          return next(results);
        });
      }
    });
  };
}).call(this);
