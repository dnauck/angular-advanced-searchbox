module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! \n * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.author.url %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n',
    jshint: {
      all: [
        './src/*.js', '*.js', '*.json'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    ngtemplates: {
      options: {
        module: 'angular-advanced-searchbox',
        htmlmin: {
          collapseBooleanAttributes:      true,
          collapseWhitespace:             true,
          removeAttributeQuotes:          true,
          removeComments:                 true, // Only if you don't use comment directives!
          removeEmptyAttributes:          true,
          removeRedundantAttributes:      true,
          removeScriptTypeAttributes:     true,
          removeStyleLinkTypeAttributes:  true
        }
      },
      template: {
        cwd: 'src/',
        src: ['*.html'],
        dest: 'tmp/templates.js'
      },
    },
    concat: {
      template: {
        options: {
        },
        src: ['src/<%= pkg.name %>.js', '<%= ngtemplates.template.dest %>'],
        dest: 'dist/<%= pkg.name %>-tpls.js'
      }
    },
    copy: {
      main : {
        files: [
          {
            src: ['src/<%= pkg.name %>.js'], 
            dest: 'dist/<%= pkg.name %>.js'
          }
        ]
      },
      template : {
        files: [
          {
            src: ['src/<%= pkg.name %>.html'], 
            dest: 'dist/<%= pkg.name %>.html'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js'],
          'dist/<%= pkg.name %>-tpls.min.js': ['dist/<%= pkg.name %>-tpls.js'],
        }
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>',
        report: 'gzip'
      },
      minify: {
        src: 'src/<%= pkg.name %>.css',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    clean: {
      temp: {
        src: [ 'tmp' ]
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitFiles: ['-a'],
        createTag: true,
        push: true,
        pushTo: 'origin'
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-angular-templates');

  // Default task(s).
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean', 'jshint:all', 'ngtemplates', 'concat', 'copy', 'uglify', 'cssmin']);
  grunt.registerTask('makeRelease', ['bump-only', 'build', 'bump-commit']);

};