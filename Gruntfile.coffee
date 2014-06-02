module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee']

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

      ui:
        files:
          'lib/public/concrete.js': ['src/views/js/concrete.coffee']

    stylus:
      compile:
        files:
          'lib/public/stylesheets/app.css': ['src/views/stylesheets/app.styl']

    copy:
      statics:
        files: [
          expand: true
          flatten: false
          cwd: 'statics/'
          src: ['**/*']
          dest: 'lib/public/'
        ]
      views:
        files:
          'lib/views/index.coffee': ['src/views/index.coffee']
          'lib/views/jobPartial.coffee': ['src/views/jobPartial.coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'default', ['build', 'watch']

  grunt.registerTask 'build', ['coffee', 'stylus', 'copy']