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

      spec:
        files: ['src/**/*.coffee','!src/views/**/*.coffee']
        tasks: ['spec:default']

    coffee:
      server:
        expand: true
        flatten: false
        cwd: 'src/'
        src: ['**/*.coffee','!views/**/*']
        dest: 'dist/'
        ext: '.js'

      ui:
        files:
          'dist/public/concrete.js': ['src/views/js/concrete.coffee']

    stylus:
      compile:
        files:
          'dist/public/stylesheets/app.css': ['src/views/stylesheets/app.styl']

    copy:
      statics:
        files: [
          expand: true
          flatten: false
          cwd: 'statics/'
          src: ['**/*']
          dest: 'dist/public/'
        ]
      views:
        files:
          'dist/views/index.coffee': ['src/views/index.coffee']
          'dist/views/jobPartial.coffee': ['src/views/jobPartial.coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-jasmine-bundle'

  grunt.registerTask 'default', ['spec:default', 'build', 'watch']

  grunt.registerTask 'build', ['coffee', 'stylus', 'copy']