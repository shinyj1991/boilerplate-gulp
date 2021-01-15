var gulp = require('gulp');
var path = require('path');
var del = require('del');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var browsersync = require('browser-sync').create();

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: 'dist'
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del('dist');
}

function asset() {
  return gulp
    .src([
      'src/_static/**/*.*',
      '!src/_static/**/*.scss'
    ])
    .pipe(gulp.dest('dist'))
}

function html() {
  return gulp
    .src('src/**/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './src/'
    }))
    .pipe(gulp.dest('dist'))
}

function scss() {
  return gulp
    .src('src/_static/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('src/_static/css'))
}

function watchFile() {
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/_static/**/*.scss', scss);
  gulp.watch([
    'src/_static/**/*.*',
    '!src/_static/**/*.scss'
  ], asset);
  gulp.watch('dist/**/*.*', browserSyncReload);
}

const build = gulp.series(clean, scss, asset, html);
const watch = gulp.parallel(watchFile, browserSync);

exports.watch = watch;
exports.default = build;