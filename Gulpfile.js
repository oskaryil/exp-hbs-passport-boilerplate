var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('./public/assets/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/assets/css/'));
});

//Watch task
gulp.task('default', function() {
  gulp.watch('./public/assets/sass/*.scss', ['sass']);
});