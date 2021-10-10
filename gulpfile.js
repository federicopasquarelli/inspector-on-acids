// Add our dependencies
var gulp = require("gulp");
var stripdebug = require("gulp-strip-debug");
var uglify = require("gulp-uglify");
var cleanCSS = require("gulp-clean-css");
var minifyHTML = require("gulp-minify-html");
var zip = require("gulp-zip");
var del = require("del");
var jsonminify = require("gulp-jsonminify");
var imagemin = require("gulp-imagemin");
var sass = require('gulp-dart-sass');
var postcss = require("gulp-postcss");
var tailwindcss = require("tailwindcss");
var purgecss = require("@fullhuman/postcss-purgecss");

const style = () => {
  return gulp
    .src("src/themes/options.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        tailwindcss("./tailwind.config.js"),
        purgecss({
          content: ["src/**/*.html", "src/**/.js"],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
      ])
    )
    .pipe(gulp.dest("src/css/"));
};

const main = () => {
  return gulp
    .src(["src/themes/dark.scss", "src/themes/light.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("src/css/"));
};

const js = () =>
  gulp
    .src("src/**/*.js")
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest("build/"));

const css = () =>
  gulp
    .src(["src/**/*.css"])
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
          },
        },
      })
    )
    .pipe(gulp.dest("build/"));

const html = () =>
  gulp.src("src/**/*.html").pipe(minifyHTML()).pipe(gulp.dest("build/"));

const jsons = () =>
  gulp.src("src/**/*.json").pipe(jsonminify()).pipe(gulp.dest("build/"));

const images = () =>
  gulp.src("src/**/*.png").pipe(imagemin()).pipe(gulp.dest("build/"));

const createzip = () =>
  gulp.src("build/**/*").pipe(zip("build.zip")).pipe(gulp.dest("./"));
const cleanBuild = () => del([__dirname + "/build/", __dirname + "/build.zip"]);
gulp.task(
  "default",
  gulp.series(cleanBuild, style, main, js, html, jsons, images, css, createzip)
);
gulp.task("style", () =>
  gulp.watch(
    ["src/themes/light.scss", "src/themes/dark.scss"],
    gulp.series(main)
  )
);
