'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require ('del'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    runSequence = require('run-sequence'),
browserSync = require('browser-sync').create();


gulp.task("concatJS", function(){
    return gulp.src('js/circle/*.js')
        .pipe(maps.init())
        .pipe(concat('global.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('js'))
});
gulp.task('scripts', ['concatJS'], function(){
    return gulp.src('js/global.js')
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('compile', function(){
    return gulp.src('sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'));
});
gulp.task('styles',['compile'],  function(){
    return gulp.src('css/global.css')
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('dist/styles'))

});


gulp.task('clean', function(){
    del('dist');
});
gulp.task('html',['scripts', 'styles'], function(){
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});


gulp.task('images', function(){
    return gulp.src('images/**/*.+(png|jpg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
});
gulp.task('watch', ['browserSync'], function(){
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('icons', function(){
    return gulp.src('icons/**/*', { base: "." })
        .pipe(gulp.dest('dist'))

});
gulp.task('build', function () {
    runSequence('clean',
        ['scripts', 'styles', 'images'],
        ['html', 'icons']
    )
});
gulp.task('default', function () {
    runSequence('clean',
        ['scripts', 'styles', 'images'],
        ['html', 'icons'],
        'watch'
    )
});
