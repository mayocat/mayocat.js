/*
 * Requirements
 */

var gulp = require('gulp'),
    argv = require('yargs').argv;

// Gulp plugins
var concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    bump = require('gulp-bump'),
    git = require('gulp-git');

/*
 * Paths
 */

var paths = {

    deps: [
        'vendor/handlebars/handlebars.min.js',
        'vendor/messageformat/messageformat.js',
        'vendor/messageformat/locale/*'
    ],

    header: 'src/header.js',
    src: 'src/mayocat.js',
    tmp: 'dist/.tmp',
    dest: 'dist',

    release: [
        'bower.json',
        'package.json'
    ],

};

/*
 * Build tasks
 */

gulp.task('minify-deps', function() {
    return gulp.src(paths.deps)
        .pipe(uglify())
        .pipe(concat('deps.min.js'))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('minify-src', function() {
    return gulp.src(paths.src)
        .pipe(uglify())
        .pipe(rename('src.min.js'))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('concat-js', ['minify-deps'], function() {
    return gulp.src([
            paths.header,
            paths.tmp + '/deps.min.js',
            paths.src
        ])
        .pipe(concat('mayocat.js'))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('concat-min-js', ['minify-deps', 'minify-src'], function() {
    return gulp.src([
            paths.header,
            paths.tmp + '/deps.min.js',
            paths.tmp + '/src.min.js'
        ])
        .pipe(concat('mayocat.min.js'))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('clean', ['minify-deps', 'minify-src', 'concat-js', 'concat-js'], function() {
    return gulp.src(paths.tmp, {read: false})
        .pipe(clean());
});

gulp.task('default', ['minify-deps', 'minify-src', 'concat-js', 'concat-min-js', 'clean']);

/*
 * Release tasks
 */

gulp.task('bump', function() {
    return gulp.src(paths.release)
        .pipe(bump({version: argv.ver}))
        .pipe(gulp.dest('./'));
});

gulp.task('commit', ['bump'], function() {
    return gulp.src(paths.release)
        .pipe(git.commit('Release v' + argv.ver));
});

gulp.task('tag', ['bump', 'commit'], function() {
    var version = 'v' + argv.ver;
    return git.tag(version, 'Release ' + version);
});

gulp.task('push', ['bump', 'commit', 'tag'], function() {
    return git.push('origin', 'master', {
        args: '--tags'
    }).end();
});

gulp.task('release', ['default', 'bump', 'commit', 'tag', 'push']);