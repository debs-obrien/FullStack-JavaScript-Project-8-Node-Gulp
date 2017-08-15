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

/* ---------------------------------------------------------------------------------------
Get js files, create sourcemap, concatanate to global.js
minify global.js and rename it all.min.js and put in dist/scripts reload if necessary
---------------------------------------------------------------------------------------*/
gulp.task("concatJS", function(){
    return gulp.src(`${paths.src}/js/**/*.js`)
        .pipe(maps.init())
        .pipe(concat('global.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${paths.src}/js`))
});
gulp.task('scripts', ['concatJS'], function(){
    return gulp.src(`${paths.src}/js/global.js`)
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(`${paths.dist}/scripts`))
        .pipe(browserSync.stream());
});

/* ---------------------------------------------------------------------------------------
 get global.scss and create sourcemap save scss as css
 minify global.css and rename it all.min.css and put in dist/styles reload if necessary
 ---------------------------------------------------------------------------------------*/
gulp.task('compile', function(){
    return gulp.src(`${paths.src}/sass/global.scss`)
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${paths.src}/css`))
});
gulp.task('styles',['compile'],  function(){
    return gulp.src(`${paths.src}/css/global.css`)
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(`${paths.dist}/styles`))
        .pipe(browserSync.stream());

});

/* ---------------------------------------------------------------------------------------
delete everything in dist folder
 ---------------------------------------------------------------------------------------*/
gulp.task('clean', function(){
    return del('dist');
});

/* ---------------------------------------------------------------------------------------
 minifiy images using cache and add to folder called content in dist
 ---------------------------------------------------------------------------------------*/
gulp.task('images', function(){
    return gulp.src(`${paths.src}/images/**/*.+(png|jpg)`)
        .pipe(cache(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ])))
        .pipe(gulp.dest(`${paths.dist}/content`));
});

/* ---------------------------------------------------------------------------------------
 minifiy icons using cache and add to dist folder
 ---------------------------------------------------------------------------------------*/
gulp.task('icons', function(){
    return gulp.src(`${paths.src}/icons/**/*`)
        .pipe(cache(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ])))
        .pipe(gulp.dest(`${paths.dist}/icons`));

});

/* ---------------------------------------------------------------------------------------
 refresh broswer useful if you make changes to html or sass or js
 ---------------------------------------------------------------------------------------*/
gulp.task('browserSync', function() {
    return browserSync.init({
        server: {
            baseDir: paths.dist
        },
    })
});

/* ---------------------------------------------------------------------------------------
 changes the html to call the new minified css and js
 then replaces all references to the images folder with content folder
 add the html to the dist folder
 call refresh incase any changes have been made
 ---------------------------------------------------------------------------------------*/
gulp.task('html', function(){
    return gulp.src(`${paths.src}/index.html`)
        .pipe(useref())
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

/* ---------------------------------------------------------------------------------------
 watch for any changes to sass, js or html and if so call styles/scripts/html
 ---------------------------------------------------------------------------------------*/
gulp.task('watch', ['browserSync'], function (){
    gulp.watch(`${paths.src}/sass/**/*.scss`, ['styles']);
    gulp.watch(`${paths.src}/js/**/*.js`, ['scripts']);
    gulp.watch([`${paths.src}/*.html`],['html']);
});

/* ---------------------------------------------------------------------------------------
 build for production first cleaning any old dist
 then run scripts, styles, images and icons
 finally run the html to change the routes of images and name of minfified files
 ---------------------------------------------------------------------------------------*/
gulp.task('build',['clean'], function(){
    gulp.start(['scripts', 'styles', 'images', 'icons']);
    return gulp.src(`${paths.src}/index.html`)
        .pipe(useref())
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest(paths.dist));
});

/* ---------------------------------------------------------------------------------------
 by typing gulp run build and once build is complete
 start watching and open browser to see changes
 ---------------------------------------------------------------------------------------*/
gulp.task('default',['build'], function(){
    gulp.start(['watch', 'browserSync']);

});

