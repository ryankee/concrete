(function() {
  var COLORS, colors, exec, git, html, jobs, mongo, parseSequence, runFile, runNextJob, runTask, runner, server, tokenize;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  colors = require('colors');
  git = require('./git');
  server = require('./server');
  exec = require('child_process').exec;
  mongo = require('mongodb');
  jobs = require('./jobs');
  parseSequence = function(input) {
    var length;
    length = input.length;
    return {
      cmd: input[length - 1],
      args: input.substring(2, length - 1)
    };
  };
  tokenize = function(input, result) {
    if (result == null) {
      result = [];
    }
    if (input === '') {
      return [''];
    }
    input.replace(/(\u001B\[.*?([@-~]))|([^\u001B]+)/g, function(m) {
      return result.push(m[0] === '\u001B' && parseSequence(m) || m);
    });
    return result;
  };
  COLORS = {
    0: '',
    1: 'bold',
    4: 'underscore',
    5: 'blink',
    30: 'fg-black',
    31: 'fg-red',
    32: 'fg-green',
    33: 'fg-yellow',
    34: 'fg-blue',
    35: 'fg-magenta',
    36: 'fg-cyan',
    37: 'fg-white',
    40: 'bg-black',
    41: 'bg-red',
    42: 'bg-green',
    43: 'bg-yellow',
    44: 'bg-blue',
    45: 'bg-magenta',
    46: 'bg-cyan',
    47: 'bg-white'
  };
  html = function(input) {
    var result;
    result = input.map(function(v) {
      var cls;
      if (typeof v === 'string') {
        return v;
      } else if (v.cmd === 'm') {
        cls = v.args.split(';').map(function(v) {
          return COLORS[parseInt(v)];
        }).join(' ');
        return "</span><span class=\"" + cls + "\">";
      } else {
        return '';
      }
    });
    return "<code><pre><span>" + (result.join('')) + "</span></pre></code>";
  };
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
    return exec(git.runner, {
      maxBuffer: 1024 * 1024
    }, __bind(function(error, stdout, stderr) {
      var err, out;
      if (error != null) {
        err = html(tokenize(error.toString()));
        return jobs.updateLog(jobs.current, "<span class='output error'>" + err + "</span>", function() {
          console.log(("" + err).red);
          return runFile(git.failure, next, false);
        });
      } else {
        out = html(tokenize(stdout.toString()));
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
          err = html(tokenize(error.toString()));
          return jobs.updateLog(jobs.current, "<span class='output error'>" + err + "</span>", function() {
            next(args);
            return console.log(("" + err).red);
          });
        } else {
          out = html(tokenize(stdout.toString()));
          return jobs.updateLog(jobs.current, "<span class='output'>" + out + "</span>", function() {
            next(args);
            return console.log(out);
          });
        }
      }, this));
    });
  };
}).call(this);
