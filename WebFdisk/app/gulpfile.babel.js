'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';

import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import Cache from 'gulp-file-cache';

import webpack from 'gulp-webpack';
import webpackConfig from './webpack.config.js';

import BS from 'browser-sync';
let browserSync = BS.create();

import mocha from 'gulp-mocha';

let cache = new Cache();

const DIR = {
    SRC		: 'client_src',
    DEST	: 'client_dist'
};

const SRC = {
	JS		: DIR.SRC + '/js/*.js',
    LIB		: DIR.SRC + '/lib/**/*',
	CSS		: DIR.SRC + '/css/*.css',
    HTML	: DIR.SRC + '/**/*.html',
    IMAGES	: DIR.SRC + '/img/*',
    SERVER	: 'server_src/**/*.js'
};

const DEST = {
    JS		: DIR.DEST + '/js',
	LIB		: DIR.DEST + '/lib',
    CSS		: DIR.DEST + '/css',
    HTML	: DIR.DEST + '/',
    IMAGES	: DIR.DEST + '/img',
    SERVER	: 'server_dist'
};

gulp.task('clean', () => {
    return del.sync([DIR.DEST]);
});

gulp.task('webpack', () => {
    return gulp.src( 'client_src/js/main.js')
           .pipe(webpack(webpackConfig))
           .pipe(gulp.dest('client_dist/'))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('lib', () => {
    return gulp.src(SRC.LIB)
          .pipe(gulp.dest(DEST.LIB))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('css', () => {
    return gulp.src(SRC.CSS)
           .pipe(cleanCSS({compatibility: 'ie8'}))
           .pipe(gulp.dest(DEST.CSS))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('html', () => {
    return gulp.src(SRC.HTML)
          .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST.HTML))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('images', () => {
    return gulp.src(SRC.IMAGES)
           .pipe(imagemin())
           .pipe(gulp.dest(DEST.IMAGES))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('babel', () => {
    return gulp.src(SRC.SERVER)
           .pipe(cache.filter())
           .pipe(babel({presets: ['es2015']}))
           .pipe(cache.cache())
           .pipe(gulp.dest(DEST.SERVER));
});

gulp.task('watch', () => {
    let watcher = {
        webpack	: gulp.watch(SRC.JS, 		['webpack']),
        // css		: gulp.watch(SRC.CSS, 		['css', 'webpack']),
		lib		: gulp.watch(SRC.LIB, 		['lib']),
		css		: gulp.watch(SRC.CSS, 		['css']),
        html	: gulp.watch(SRC.HTML, 		['html']),
        images	: gulp.watch(SRC.IMAGES, 	['images']),
        babel	: gulp.watch(SRC.SERVER, 	['babel'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('start', ['babel'], () => {
    return nodemon({
        script: DEST.SERVER + '/main.js',
        watch: DEST.SERVER
    });
});

gulp.task('browser-sync', () => {
	console.log( __dirname );
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        // files: [ __dirname + "/client_dist/**/*.*"],
        port: 7001,
    })

});

gulp.task('test', () => {
	return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('testone', () => {
	return gulp.src(['test_one/filesystems_api.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('default', [
			'clean',
			'webpack',
			'lib',
			'css',
			'html',
			'images',
			'babel',
			'watch',
			'start',
			'browser-sync',
			], () => {

    gutil.log('Gulp is running');

});
