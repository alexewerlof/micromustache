var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var size   = require('gulp-size');
var rename = require('gulp-rename');
var bump   = require('gulp-bump');
var header = require('gulp-header');
var del    = require('del');
var pkg    = require('./package.json');

var src = './src/*.js';

gulp.task('clean', function(cb) {
    del(['dist/**/*'], cb);
});

gulp.task('jshint', function() {
    gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

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

gulp.task('minify', ['jshint'], function() {
    gulp.src(src)
        .pipe(uglify())
        .pipe(header('/*!<%= pkg.name %> <%= pkg.version %>*/', { pkg: pkg } ))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(size());
});

gulp.task('default', ['minify', 'copy-dev'], function() {
    gulp.src('package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});

//Author: npm publish .