var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var merge = require('merge-stream');

gulp.task('sass', function() {
    gulp.src('./public/assets/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/assets/css/'));
});

gulp.task('minify-css', function() {
  return gulp.src('./public/assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public/assets/css/'));
});

// gulp.task('build', function() {
//   return gulp.src('./public/assets/css/*.css')
//     .pipe(concat('build.css'))
//     .pipe(gulp.dest('./public/assets/css/'));
// });

//Watch task
gulp.task('watch', function() {
  gulp.watch('./public/assets/sass/*.scss', ['sass']);
  gulp.watch('./public/assets/css/*.css', ['minify-css']);
  // gulp.watch('./public/assets/css/*.css', ['build']);
});