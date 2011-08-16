(function() {
  var colors, exec, git, jobs, mongo, runFile, runNextJob, runTask, runner, server;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  colors = require('colors');
  git = require('./git');
  server = require('./server');
  exec = require('child_process').exec;
  mongo = require('mongodb');
  jobs = require('./jobs');
  runner = module.exports = {
    build: function() {
      return runNextJob();
    }
  };
  runNextJob = function() {
    if (jobs.current != null) {
      return false;
    }
    return jobs.next(function() {
      return git.pull(function() {
        return runTask(function(success) {
          return jobs.currentComplete(success, function() {
            return runNextJob();
          });
        });
      });
    });
  };
  runTask = function(next) {
    jobs.updateLog(jobs.current, "Executing '" + git.runner + "'");
    return exec(git.runner, __bind(function(error, stdout, stderr) {
      var err, out;
      if (error != null) {
        err = error.toString();
        return jobs.updateLog(jobs.current, "<span class='output error'>" + err + "</span>", function() {
          console.log(("" + err).red);
          return runFile(git.failure, next, false);
        });
      } else {
        out = stdout.toString();
        return jobs.updateLog(jobs.current, "<span class='output'>" + out + "</span>", function() {
          console.log(out);
          return runFile(git.success, next, true);
        });
      }
    }, this));
  };
  runFile = function(file, next, args) {
    if (args == null) {
      args = null;
    }
    return jobs.updateLog(jobs.current, "Executing " + file, function() {
      console.log(("Executing " + file).grey);
      return exec(file, __bind(function(error, stdout, stderr) {
        var err, out;
        if (error != null) {
          err = error.toString();
          return jobs.updateLog(jobs.current, "<span class='output error'>" + err + "</span>", function() {
            next(args);
            return console.log(("" + err).red);
          });
        } else {
          out = stdout.toString();
          return jobs.updateLog(jobs.current, "<span class='output'>" + out + "</span>", function() {
            next(args);
            return console.log(out);
          });
        }
      }, this));
    });
  };
}).call(this);
