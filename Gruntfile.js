module.exports = function(grunt) {

  grunt.initConfig({
    exec: {
      jasmine: {
        command:'jasmine-node spec/*_spec.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        jshintignore:'.jshintignore'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      }
    },
    watch: {
      test : {
        files: ['lib/**/*.js', 'spec/**/*_spec.js', 'bin/**/*'],
        tasks: 'test'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['jshint', 'exec:jasmine']);

  // Default task.
  grunt.registerTask('default', ['test']);

};
