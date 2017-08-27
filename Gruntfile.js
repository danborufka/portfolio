module.exports = function(grunt) {
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
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['sass', 'cssmin'/*, 'uglify', 'watch'*/]);
};