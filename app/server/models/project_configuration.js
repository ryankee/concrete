module.exports = (function(){
  // build out defaults
  var parser = {
    name:'Job ' + new Date(),
    store:'memory',
    script:undefined,
    config:function(obj){
      for(var key in obj){
        parser.config[key] = obj[key];
      }
    }
  };

  return {
    create:function(file){
      require(file)(parser);
      return parser;
    }
  };
}());
