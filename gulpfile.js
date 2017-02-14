var gulp = require('gulp'),
    connect = require('gulp-connect'),
    modRewrite = require('connect-modrewrite');

gulp.task('connect', function () {
  connect.server({
    root: './',
    host: 'local.trentos.app',
    port: 9090,
    livereload: true,
    middleware: function () {
      return [
        modRewrite([
          '^/api/(.*)$ http://trentos.app/api/$1 [P]',
          '^/auth/(.*)$ http://trentos.app/auth/$1 [P]',
        ])
      ];
    }
  });
});