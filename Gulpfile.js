const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const merge = require("merge-stream");
const babel = require("gulp-babel");
const print = require("gulp-print");

gulp.task("js", function() {
  return gulp
    .src("public/assets/js/src/**/*.js") // #1. select all js files in the app folder
    .pipe(print()) // #2. print each file in the stream
    .pipe(babel({ presets: ["es2015"] })) // #3. transpile ES2015 to ES5 using ES2015 preset
    .pipe(gulp.dest("public/assets/js/dist")); // #4. copy the results to the build folder
});

gulp.task("sass", function() {
  gulp
    .src("./public/assets/sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./public/assets/css/"));
});

gulp.task("minify-css", function() {
  return gulp
    .src("./public/assets/css/*.css")
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sourcemaps.write())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./public/assets/css/"));
});

// gulp.task('build', function() {
//   return gulp.src('./public/assets/css/*.css')
//     .pipe(concat('build.css'))
//     .pipe(gulp.dest('./public/assets/css/'));
// });

//Watch task
gulp.task("watch", function() {
  gulp.watch("./public/assets/sass/*.scss", ["sass"]);
  gulp.watch("./public/assets/js/src/*.js", ["js"]);
  // gulp.watch('./public/assets/css/*.css', ['minify-css']);
  // gulp.watch('./public/assets/css/*.css', ['build']);
});
