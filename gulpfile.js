var gulp = require('gulp');

var concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var paths = {

    deps: [
        'vendor/handlebars/handlebars.min.js',
        'vendor/messageformat/messageformat.js',
        'vendor/messageformat/locale/*'
    ],

    header: 'src/header.js',
    src: 'src/mayocat.js',
    tmp: 'dist/.tmp',
    dest: 'dist'

};

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
