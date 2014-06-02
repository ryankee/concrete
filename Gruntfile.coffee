module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee:server']

      stylus:
        files: ['src/views/stylesheets/app.styl']
        tasks: ['stylus:compile']

    coffee:
      server:
        expand: true
        flatten: false
        cwd: 'src/'
        src: ['**/*.coffee','!views/**/*']
        dest: 'lib/'
        ext: '.js'

    stylus:
      compile:
        files:
          'lib/public/stylesheets/app.css': ['src/views/stylesheets/app.styl']


  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'

  grunt.registerTask 'default', ['build', 'watch']

  grunt.registerTask 'build', ['coffee', 'stylus']