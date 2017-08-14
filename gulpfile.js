'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require ('del');


gulp.task("scripts", function(){
    return gulp.src([
        'js/circle/autogrow.js',
        'js/circle/circle.js'
        ])
        .pipe(maps.init())
        .pipe(concat('global.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('js'))
});
gulp.task('minifyJS', ['scripts'], function(){
    return gulp.src('js/global.js')
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('styles', function(){
    return gulp.src('sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function(){
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/global.js', ['scripts'])

});
gulp.task('clean', function(){
    del('dist');
});

gulp.task('build', ['minifyJS', 'styles'], function(){
    return gulp.src(['css/all.min.css', 'js/all.min.js', 'images/**, ' +
    'icons/**', 'index.html'], {base: './'})
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function(){
    gulp.start('build');
});