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
      path = require('path');
      if (target.toString().charAt(0) !== '/') {
        target = process.cwd() + '/' + target;
      }
      process.chdir(target);
      git.target = path.normalize(target + '/.git/');
      git.failure = path.normalize(target + '/.git/hooks/build-failed');
      git.success = path.normalize(target + '/.git/hooks/build-worked');
      return fs.exists(git.target, function(exists) {
        if (exists === false) {
          console.log(("'" + target + "' is not a valid Git repo").red);
          process.exit(1);
        }
        getBranch();
        return getRunner();
      });
    },
    pull: function(next) {
      var jobs, out;
      jobs = require('./jobs');
      out = "Pulling '" + git.branch + "' branch";
      return jobs.updateLog(jobs.current, out, function() {
        var _this = this;
        console.log(out.grey);
        return exec('git fetch && git reset --hard origin/' + git.branch, function(error, stdout, stderr) {
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
        git.branch = 'master';
        return gitContinue();
      } else {
        git.branch = stdout.toString().replace(/[\s\r\n]+$/, '');
        if (git.branch === '') {
          git.branch = 'master';
        }
        return gitContinue();
      }
    }, this));
  };
  getRunner = function() {
    return exec('git config --get ' + git.config.runner, __bind(function(error, stdout, stderr) {
      if (error != null) {
        console.log(("Git.getRunner: " + error).red);
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
      console.log('Git.gitContinue: You must specify a Git runner'.red);
      process.exit(1);
    } else if (git.runner === '') {
      return false;
    }
    return readyCallback();
  };
}).call(this);
