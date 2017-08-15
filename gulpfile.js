'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require ('del'),
    useref = require('gulp-useref');


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
        .pipe(gulp.dest('dist/scripts'));
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
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function(){
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/global.js', ['scripts'])

});
gulp.task('clean', function(){
    del('dist');
});
gulp.task('html', function(){
    gulp.src('index.html')
        .pipe(useref())
        //.pipe(gulpif('*.js', scripts()))
        //.pipe(gulpif('*.css', styles()))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['html,', 'scripts', 'styles'], function(){
    return gulp.src(['css/all.min.css', 'js/all.min.js', 'images/**, ' +
    'icons/**', 'index.html'], {base: './'})
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function(){
    gulp.start('build');
});