// Add our dependencies
var gulp = require("gulp");
var stripdebug = require("gulp-strip-debug");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");

const js = () =>
  gulp
    .src("src/**/*.js")
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest("build/"));

const css = () =>
  gulp
    .src(["src/**/*.css", "!src/**/*.min.css"])
    .pipe(minify())
    .pipe(gulp.dest("build/"));
const copycss = () => gulp.src(["src/**/*.min.css"]).pipe(gulp.dest("build/"));
const html = () =>
  gulp.src("src/**/*.html").pipe(minifyHTML()).pipe(gulp.dest("build/"));
const jsons = () => gulp.src("src/**/*.json").pipe(gulp.dest("build/"));
const images = () => gulp.src("src/**/*.png").pipe(gulp.dest("build/"));

gulp.task("default", gulp.series(js, html, jsons, images, css, copycss));
