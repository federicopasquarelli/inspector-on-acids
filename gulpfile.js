// Add our dependencies
var gulp = require("gulp");
var stripdebug = require("gulp-strip-debug");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var zip = require("gulp-zip");
var del = require("del");

var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var tailwindcss = require("tailwindcss");
var autoprefixer = require("autoprefixer");
var purgecss = require("@fullhuman/postcss-purgecss");

const style = () => {
  return gulp
    .src("src/options.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        tailwindcss("./tailwind.config.js"),
        autoprefixer,
        purgecss({
          content: ["src/**/*.html", "src/**/.js"],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
      ])
    )
    .pipe(gulp.dest("src/"));
};
const main = () => {
  return gulp
    .src("src/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("src/"));
};

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
const createzip = () =>
  gulp.src("build/**/*").pipe(zip("build.zip")).pipe(gulp.dest("./"));

gulp.task(
  "default",
  gulp.series(style, main, js, html, jsons, images, css, copycss, createzip)
);
gulp.task("style", style);
