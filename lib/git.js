(function() {
  var colors, exec, getBranch, getRunner, git, gitContinue, readyCallback;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  exec = require('child_process').exec;
  colors = require('colors');
  readyCallback = null;
  git = module.exports = {
    runner: '',
    branch: '',
    config: {
      runner: 'concrete.runner',
      branch: 'concrete.branch'
    },
    init: function(target, callback) {
      var path;
      readyCallback = callback;
      git.target = target + '.git/';
      git.failure = target + '.git/hooks/build-failed';
      git.success = target + '.git/hooks/build-worked';
      path = require('path');
      return path.exists(git.target, function(exists) {
        if (exists === false) {
          console.log(("'" + target + "' is not a valid Git repo").red);
          process.exit(1);
        }
        process.chdir(target);
        getBranch();
        return getRunner();
      });
    },
    pull: function(next) {
      var jobs, out;
      jobs = require('./jobs');
      out = "Pulling '" + git.branch + "' branch";
      return jobs.updateLog(jobs.current, out, function() {
        console.log(out.grey);
        return exec('git pull origin ' + git.branch, __bind(function(error, stdout, stderr) {
          if (error != null) {
            out = "" + error;
            jobs.updateLog(jobs.current, out);
            return console.log(out.red);
          } else {
            out = "Updated '" + git.branch + "' branch";
            return jobs.updateLog(jobs.current, out, function() {
              console.log(out.grey);
              return next();
            });
          }
        }, this));
      });
    }
  };
  getBranch = function() {
    return exec('git config --get ' + git.config.branch, __bind(function(error, stdout, stderr) {
      if (error != null) {
        console.log(("" + error).red);
        return process.exit(1);
      } else {
        git.branch = stdout.toString().replace(/[\s\r\n]+$/, '');
        if (git.branch === '') {
          git.branch = 'none';
        }
        return gitContinue();
      }
    }, this));
  };
  getRunner = function() {
    return exec('git config --get ' + git.config.runner, __bind(function(error, stdout, stderr) {
      if (error != null) {
        console.log(("" + error).red);
        return process.exit(1);
      } else {
        git.runner = stdout.toString().replace(/[\s\r\n]+$/, '');
        if (git.runner === '') {
          git.runner = 'none';
        }
        return gitContinue();
      }
    }, this));
  };
  gitContinue = function() {
    if (git.branch === 'none') {
      git.branch = 'master';
    } else if (git.branch === '') {
      return false;
    }
    if (git.runner === 'none') {
      console.log('You must specify a Git runner'.red);
      process.exit(1);
    } else if (git.runner === '') {
      return false;
    }
    return readyCallback();
  };
}).call(this);
