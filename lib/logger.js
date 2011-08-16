(function() {
  var Logger;
  Logger = module.exports = function(currentStream) {
    return {
      stream: currentStream != null ? currentStream : '',
      log: function(args) {
        return this.stream += "" + args + "\n";
      }
    };
  };
}).call(this);
