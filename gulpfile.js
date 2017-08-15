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
    replace = require('gulp-replace'),
browserSync = require('browser-sync').create();

const paths = {
    src: 'src',
    dist: 'dist'
};

gulp.task("concatJS", function(){
    return gulp.src('/js/**/*.js')
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
        .pipe(browserSync.stream());
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
    return del('dist');
});
gulp.task('html',['scripts', 'styles', 'images'], function(){
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest('dist'));
});


gulp.task('images', function(){
    return gulp.src('images/**/*.+(png|jpg)')
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/content'));
});

gulp.task('icons', function(){
    return gulp.src('icons/**/*', { base: "." })
        .pipe(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest(`${paths.dist}`));

});
gulp.task('serve', function() {
    return browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
});

gulp.task('watch', function(){
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('build',['clean', 'styles', 'scripts', 'images', 'icons', 'html']);
gulp.task('default',['build'], function(){
    gulp.start(['serve', 'watch']);
});

