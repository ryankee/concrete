(function() {
  var colors, exec, getBranch, getPass, getRunner, getUser, git, gitContinue, readyCallback;

  exec = require('child_process').exec;

  colors = require('colors');

  readyCallback = null;

  git = module.exports = {
    runner: '',
    branch: '',
    user: '',
    pass: '',
    config: {
      runner: 'concrete.runner',
      branch: 'concrete.branch',
      user: 'concrete.user',
      pass: 'concrete.pass'
    },
    init: function(target, callback) {
      var fs, path;
      readyCallback = callback;
      path = require('path');
      if (target.toString().charAt(0) !== '/') {
        target = process.cwd() + '/' + target;
      }
      process.chdir(target);
      git.target = path.normalize(target + '/.git/');
      git.failure = path.normalize(target + '/.git/hooks/build-failed');
      git.success = path.normalize(target + '/.git/hooks/build-worked');
      fs = require('fs');
      return fs.exists(git.target, function(exists) {
        if (exists === false) {
          console.log(("'" + target + "' is not a valid Git repo").red);
          process.exit(1);
        }
        getUser();
        getPass();
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
        return exec('git fetch && git reset --hard origin/' + git.branch, (function(_this) {
          return function(error, stdout, stderr) {
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
          };
        })(this));
      });
    }
  };

  getUser = function() {
    return exec('git config --get ' + git.config.user, (function(_this) {
      return function(error, stdout, stderr) {
        if (error != null) {
          return git.user = '';
        } else {
          return git.user = stdout.toString().replace(/[\s\r\n]+$/, '');
        }
      };
    })(this));
  };

  getPass = function() {
    return exec('git config --get ' + git.config.pass, (function(_this) {
      return function(error, stdout, stderr) {
        if (error != null) {
          return git.pass = '';
        } else {
          return git.pass = stdout.toString().replace(/[\s\r\n]+$/, '');
        }
      };
    })(this));
  };

  getBranch = function() {
    return exec('git config --get ' + git.config.branch, (function(_this) {
      return function(error, stdout, stderr) {
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
      };
    })(this));
  };

  getRunner = function() {
    return exec('git config --get ' + git.config.runner, (function(_this) {
      return function(error, stdout, stderr) {
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
      };
    })(this));
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
