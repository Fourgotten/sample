'use strict';
console.time("Loading plugins"); //start measuring

var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'), // сжимает, оптимизирует
    minifyHTML = require('gulp-minify-html'), //минификация html
    tinypng = require('gulp-tinypng-compress'), //tinypng
    $ = require('gulp-load-plugins')();


    /*shell = require('gulp-shell'), 
    less = require('gulp-less'), 
    
    imagemin = require('gulp-imagemin'), //просто сжималка
   
    
    uglify = require('gulp-uglify'), //уродификация js
    
    
    
    
    concat = require('gulp-concat'), // объединяет файлы в один бандл
    minifyCSS = require('gulp-minify-css'), // сжимает, оптимизирует
    rename = require("gulp-rename"), // переименовывает
    
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-core');*/
console.timeEnd("Loading plugins"); //end measuring

gulp.task('less', function () {
    gulp.src('./src/style.less')
        .pipe($.less())
        .on('error', swallowError)
        //.pipe($.concat('style.css'))
        .pipe(minifyCSS())
        .pipe($.rename({
            suffix: ".min"
        }))
       
        .pipe(gulp.dest('./build/css'));
});

gulp.task('compressImg', function () {
    gulp.src('./images/**/*.{png}')
        .pipe($.imagemin({
            optimizationLevel: 8,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./build/images'));
});

gulp.task('imgmin', function () {
    try{
    gulp.src('./images/*.{png,jpg,jpeg}')
        .pipe($.imagemin({
            optimizationLevel: 8,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./build/images'))
    } catch (err){
        console.error('Error catched: ' + err);
    }

});

gulp.task('tinypng', function () {
    gulp.src('./images/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: '2ha7GkNrhfGMaG4-xuXIl4_Qit9wpmSz',
            checkSigs: true,
            sigFile: './images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('./build/images'));
});

gulp.task('minifyHTML', function () {
    gulp.src('./*.{html,htm}')
        .pipe(minifyHTML({}))
        .pipe(gulp.dest('./build'))
});

gulp.task('uglify', function () {
    gulp.src('./js/*.js')
        .pipe($.uglify())
        .pipe($.concat('main.js'))
        .pipe($.rename({
                suffix: ".min"
            }))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('copyfiles', function() {
   gulp.src('./*.php')
   .pipe(gulp.dest('./build'));
});

gulp.task('rsync', $.shell.task([
  'nohup realsync . &> /dev/null &',
]));

gulp.task('zipdist', function () {
    return gulp.src('build/*')
        .pipe($.zip('to_server.zip'))
        .pipe(gulp.dest('build/zips'));
});


gulp.task('serve', ['less', 'minifyHTML' , 'uglify', 'copyfiles','zipdist'], function() {
	

	

	gulp.watch([
		'./src/*.less',
	], ['less']);
    
    gulp.watch([
		'./js/*.js',
	], ['uglify']);
    
     gulp.watch([
		'./*.html',
	], ['minifyHTML']);
    
     gulp.watch([
		'./*.php',
	], ['copyfiles']);

	
});

gulp.task('default', ['serve']);

gulp.task('build', ['less', 'minifyHTML' , 'uglify']);

function swallowError (error) {

    console.log(error.toString());

    this.emit('end');
}
