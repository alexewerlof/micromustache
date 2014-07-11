var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var size   = require('gulp-size');
var rename = require('gulp-rename');
var header = require('gulp-header');
var install= require("gulp-install");
var del    = require('del');
var pkg    = require('./package.json');

var src = './src/*.js';

//remove publishable resources
gulp.task('clean', function(cb) {
    del(['dist/**/*'], cb);
});

//check the source code for quality
gulp.task('jshint', function() {
    gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//copy the plain source code (with comments and pretty formatting) into the dist folder
gulp.task('copy-dev', ['jshint'], function() {
    var headerTemplate = [
        "/*! <%= pkg.name %> v.<%= pkg.version %> ",
        " * <%= pkg.description %>",
        " * @license <%= pkg.license %>",
        " */",
        ""
    ].join('\n');
    gulp.src(src)
        .pipe(header(headerTemplate, { pkg: pkg } ))
        .pipe(gulp.dest('dist'))
        .pipe(size());
});

//minify the source into the dist folder
gulp.task('minify', ['jshint'], function() {
    gulp.src(src)
        .pipe(uglify())
        .pipe(header('/*!<%= pkg.name %> <%= pkg.version %>*/', { pkg: pkg } ))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(size());
});

//the default task will minify and copy the development version into the dist folder
gulp.task('default', ['minify', 'copy-dev'], function() {
});

//make it ready to publish using node and bower
gulp.task('publish', function() {
    gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});