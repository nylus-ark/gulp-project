// gulpfile.js

const gulp = require("gulp");
const del = require('del');
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const fileinclude = require('gulp-file-include');

// Clean tast to remove dist folder
gulp.task('clean', function () {
  return del(['dist']);
});

// Compile Sass to CSS and move to dist/
gulp.task("sass", function () {
  return gulp
    .src("src/scss/main.scss")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
});

// Concatenate and minify main JS file and move to dist/
gulp.task("main-js", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
});

// Move HTML file to dist/
gulp.task("html", function () {
  return gulp
    .src("src/index.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("dist"));
});

// Watch for changes to files and run tasks
gulp.task("watch", function () {
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("src/js/**/*.js", gulp.series("main-js"));
  gulp.watch("src/index.html", gulp.series("html"));
});

// Default task runs all other tasks and then watches for changes
gulp.task(
  "default",
  gulp.parallel("sass", "main-js", "html", "watch")
);

// Build task
gulp.task('build', gulp.series('clean', gulp.parallel("sass", "main-js", "html", "watch")));
