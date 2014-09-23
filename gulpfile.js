var gulp = require('gulp');

var uglify        = require('gulp-uglify');
var size          = require('gulp-size');
var rename        = require('gulp-rename');
var del           = require('del');
var micromustache = require('./src/micromustache.js'); //yes micromustache is used in its own Gulpfile!
var pkg           = require('./package.json');

var path = {
    src : './src',
    dist: './dist'
};

var headerTemplates = {
    unminified:
        "/*! {{name}} v.{{version}}\n" +
        " * {{description}}\n" +
//        " * {{repository.url}}\n" +
        " * @license {{license}}\n" +
        " */\n" +
        "",
    minified: '/*!{{name}} {{version}}*/'
};

//remove publishable resources
gulp.task('clean', function(cb) {
    return del([path.dist + '/**/*'], cb);
});

//copy the plain source code (with comments and pretty formatting) into the dist folder
gulp.task('dev', function() {
    return gulp.src(path.src + '/*.js')
        //TODO: add headers later
        //.pipe(header(bigHeaderTemplate, pkg))
        .pipe(gulp.dest(path.dist));
});

//minify the source into the dist folder
gulp.task('minify', function() {
    return gulp.src(path.src + '/*.js')
        .pipe(uglify())
        //.pipe(header(headerTemplates.minified, pkg ))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist));
});

//the default task will minify and copy the development version into the dist folder
gulp.task('default', ['minify', 'dev'], function() {
    return gulp.src(path.dist + '/*')
        .pipe(size({showFiles: true}));
});

//prepares the package for release and inform the developer to take some actions
gulp.task('release', ['minify', 'dev'], function() {
    console.info('Run these commands:');
    console.info('git tag -a v' + pkg.version + ' -m "Release version ' + pkg.version + '"');
    console.info('npm publish');
    return true;
});
