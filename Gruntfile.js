/*
 * grunt-ejs-static
 * https://github.com/shaekuronen/grunt-ejs-static
 *
 * Copyright (c) 2013 Shae Kuronen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      preview: ['demo/preview'],
      optimize: ['demo/production'],
      post_optimize: [
        'demo/production/pages',
        'demo/production/templates',
        'demo/production/head.ejs',
        'demo/production/scripts.ejs'
      ],
      test: ['tests/test*']
    },

    copy: {
      preview: {
        files: [
          {expand: true, cwd: 'demo/dev/', src: ['img/**'], dest: 'demo/preview/'},
          {expand: true, cwd: 'demo/dev/', src: ['css/**'], dest: 'demo/preview/'},
          {expand: true, cwd: 'demo/dev/', src: ['js/**'], dest: 'demo/preview/'}
        ]
      },
      optimize: {
        files: [
          // temporary files for usemin task
          {expand: true, flatten: true, cwd: 'demo/dev/', src: ['templates/global/head.ejs'], dest: 'demo/production/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'demo/dev/', src: ['templates/global/scripts.ejs'], dest: 'demo/production/', filter: 'isFile'},
          // end temporary files for usemin task
          // temporary files for ejs_static task
          {expand: true, cwd: 'demo/dev/', src: ['pages/**'], dest: 'demo/production/'},
          {expand: true, cwd: 'demo/dev/', src: ['templates/**'], dest: 'demo/production/'},
          // end temporary files for ejs_static task
          {expand: true, cwd: 'demo/dev/', src: ['img/**'], dest: 'demo/production/'},
          {expand: true, cwd: 'demo/dev/', src: ['css/**'], dest: 'demo/production/'},
          {expand: true, cwd: 'demo/dev/', src: ['js/**'], dest: 'demo/production/'},
          {expand: true, cwd: 'demo/dev/', src: ['data/**'], dest: 'demo/production/'}
        ]
      }
    },

    // get the scripts inside preview:js block
    'useminPrepare': {
      html: [
        'demo/production/head.ejs',
        'demo/production/scripts.ejs'
      ]
    },

    // update the scripts links to point to the concatenated and minified js/main.js
    usemin: {
      html: [
        'demo/production/templates/global/head.ejs',
        'demo/production/templates/global/scripts.ejs'
      ]
    },

    ejs_static: {
      preview: {
        options: {
          dest: 'demo/preview',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts/',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      optimize: {
        options: {
          dest: 'demo/production',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      test1: {
        options: {
          dest: 'tests/test1',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      test2: {
        options: {
          dest: 'tests/test2',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: true,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      test3: {
        options: {
          dest: 'tests/test3',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      test4: {
        options: {
          dest: 'tests/test4',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: false,
          file_extension: '.html'
        }
      },
      test5: {
        options: {
          dest: 'tests/test5',
          path_to_data: 'demo/dev/data/data.json',
          path_to_layouts: 'demo/dev/layouts',
          index_page: 'home',
          parent_dirs: false,
          underscores_to_dashes: true,
          file_extension: '.php'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/ejs_static_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // build the site for preview during development
  grunt.registerTask('preview', [
    'clean:preview',
    'copy:preview',
    'ejs_static:preview'
  ]);

  // optimize the site before deploying to production
  grunt.registerTask('optimize', [
    'clean:optimize',
    'copy:optimize',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'usemin',
    'ejs_static:optimize',
    'clean:post_optimize'
  ]);

  // test
  grunt.registerTask('test', [
    'clean:test',
    'ejs_static:test1',
    'ejs_static:test2',
    'ejs_static:test3',
    'ejs_static:test4',
    'ejs_static:test5',
    'nodeunit'
  ]);

};
