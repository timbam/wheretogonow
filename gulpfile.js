var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpif = require("gulp-if");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var browserify = require("browserify");
var watchify = require("watchify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");

var production = process.env.NODE_ENV === "production";

var dependencies = [
  "react",
  "react-dom",
  "react-router",
  "redux",
  "underscore"
];

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task(
  "browserify-vendor",
  gulp.series(function() {
    return browserify()
      .require(dependencies)
      .bundle()
      .pipe(source("vendor.bundle.js"))
      .pipe(buffer())
      .pipe(gulpif(production, uglify({ mangle: false })))
      .pipe(gulp.dest("public/js"));
  })
);

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task(
  "browserify",
  gulp.series("browserify-vendor", function() {
    return browserify({ entries: "src/index.js", debug: true })
      .external(dependencies)
      .transform(babelify, { presets: ["react", "es2015", "stage-1"] })
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gulpif(production, uglify({ mangle: false })))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("public/js"));
  })
);

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task(
  "browserify-watch",
  gulp.series("browserify-vendor", function() {
    var bundler = watchify(
      browserify({ entries: "src/index.js", debug: true }, watchify.args)
    );
    bundler.external(dependencies);
    bundler.transform(babelify, { presets: ["react", "es2015", "stage-1"] });
    bundler.on("update", rebundle);
    return rebundle();

    function rebundle() {
      var start = Date.now();
      return bundler
        .bundle()
        .on("error", function(err) {
          gutil.log(gutil.colors.red(err.toString()));
        })
        .on("end", function() {
          gutil.log(
            gutil.colors.green(
              "Finished rebundling in",
              Date.now() - start + "ms."
            )
          );
        })
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/js/"));
    }
  })
);

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task("styles", function() {
  return gulp
    .src("src/style/main.less")
    .pipe(
      plumber({
        errorHandler: function(err) {
          console.log(err);
          this.emit("end");
        }
      })
    )
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest("public/css"));
});

gulp.task("watch", function() {
  gulp.watch("src/style/**/*.less", ["styles"]);
});

gulp.task("default", ["styles", "browserify-watch", "watch"]);
gulp.task("build", ["styles", "browserify"]);
