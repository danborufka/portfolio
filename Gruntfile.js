module.exports = function(grunt) {
  var tasks = ['sass', 'cssmin', 'uglify', 'compress'];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
        main: {
            expand: true,
            flatten: true,
            ext: '.css',
            src: 'src/sass/*.*',
            dest: 'src/css/',
        }
    },
    cssmin: {
        main: {
            expand: true,
            flatten: true,
            ext: '.min.css',
            src: 'src/css/*.css',
            dest:'public/css/'
        }
    },
    uglify: {
        main: {
            expand: true,
            flatten: true,
            ext: '.min.js',
            src: 'src/js/*.js',
            dest:'public/js/'
        }
    },
    compress: {
        main: {
            options:    { mode: 'gzip'},
            expand:     true,
            cwd:        'public/',
            rename:     (dest, src) => `public/${src}.gz`,
            src:        ['**/*.js', '**/*.png', '**/*.jpg']
        }
    },
    watch: {
      main: {
        files: ['src/*/*.*'],
        tasks
      }
    }
  });

  tasks.push('watch');

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', tasks);
};