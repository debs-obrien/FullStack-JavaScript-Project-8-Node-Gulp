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
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    replace = require('gulp-replace'),
browserSync = require('browser-sync').create();

const paths = {
    src: 'src',
    dist: 'dist'
};

gulp.task("concatJS", function(){
    return gulp.src(`${paths.src}/js/**/*.js`)
        .pipe(maps.init())
        .pipe(concat('global.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${paths.src}/js`))
        .pipe(browserSync.stream());
});
gulp.task('scripts', ['concatJS'], function(){
    return gulp.src(`${paths.src}/js/global.js`)
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(`${paths.dist}/scripts`))
});

gulp.task('compile', function(){
    return gulp.src(`${paths.src}/sass/global.scss`)
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${paths.src}/css`))
        .pipe(browserSync.stream());
});
gulp.task('styles',['compile'],  function(){
    return gulp.src(`${paths.src}/css/global.css`)
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(`${paths.dist}/styles`))

});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('clean', function(){
    return del('dist');
});


gulp.task('images', function(){
    return gulp.src(`${paths.src}/images/**/*.+(png|jpg)`)
        .pipe(cache(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ])))
        .pipe(gulp.dest(`${paths.dist}/content`));
});

gulp.task('icons', function(){
    return gulp.src(`${paths.src}/icons/**/*`)
        .pipe(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest(`${paths.dist}/icons`));

});
gulp.task('browserSync', function() {
    return browserSync.init({
        server: {
            baseDir: '.'
        },
    })
});
gulp.task('watch', ['browserSync'], function (){
    gulp.watch(`${paths.src}/sass/**/*.scss`, ['styles']);
    gulp.watch(`${paths.src}/js/**/*.js`, ['scripts']);
    gulp.watch(['*.css'], ['bs-reload']);
    gulp.watch(['*.html'], ['bs-reload']);
});

gulp.task('build',['clean'], function(){
    gulp.start(['scripts', 'styles', 'images', 'icons']);
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('default',['build'], function(){
    gulp.start(['watch', 'browserSync']);

});

