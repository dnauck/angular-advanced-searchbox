module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! \n * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.author.url %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n',

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>',
        report: 'gzip'
      },
      minify: {
        src: 'src/<%= pkg.name %>.css',
        dest: 'build/<%= pkg.name %>.min.css'
      }
    },
    copy: {
      template : {
        files: [
          {
            src: ['src/angular-advanced-searchbox.html'], 
            dest: 'build/angular-advanced-searchbox.html'
          }
        ]
      }
    },
    jshint: {
      all: [
        './src/*.js', '*.json'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['jshint:all', 'uglify', 'cssmin', 'copy']);

};