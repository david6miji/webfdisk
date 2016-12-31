'use strict';

import gulp 			from 'gulp';
import gutil 			from 'gulp-util';
import requireDir 		from 'require-dir';
	
import del 				from 'del';
import babel 			from 'gulp-babel';
import nodemon 			from 'gulp-nodemon';
import Cache 			from 'gulp-file-cache';

import webpack 			from 'gulp-webpack';
import webpackConfig 	from './webpack.config.js';

import BS 				from 'browser-sync';
import mocha 			from 'gulp-mocha';

let cache 			= new Cache();

global.CLIENT_DIR = {
    SRC		: 'client_src',
    DEST	: 'client_dist'
};

global.SERVER_DIR = {
    SRC		: 'server_src',
    DEST	: 'server_dist'
};

global.SERVER_SRC = {
    JS		: SERVER_DIR.SRC + '/**/*.js',
};

global.browserSync 	= BS.create();

requireDir(  './gulp_tasks/' );

gulp.task('client:clean', () => {
    return del.sync([CLIENT_DIR.DEST]);
});

gulp.task('client:webpack', () => {
    return gulp.src('')
           .pipe(webpack(webpackConfig))
           .pipe(gulp.dest(CLIENT_DIR.DEST))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('server:babel', () => {
    return gulp.src(SERVER_SRC.JS)
           .pipe(cache.filter())
           .pipe(babel({presets: ['es2015']}))
           .pipe(cache.cache())
           .pipe(gulp.dest(SERVER_DIR.DEST));
});

gulp.task( 'server:watch', () => {
    let watcher = {
        babel	: gulp.watch( SERVER_SRC.JS, 	['server:babel'])
    };

    let notify = (event) => {
        gutil.log( 'File', 
		            gutil.colors.yellow(event.path), 
					'was', 
					gutil.colors.magenta(event.type)
				);
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
	
});

gulp.task('server:start', ['server:babel'], () => {
    return nodemon({
        script: SERVER_DIR.DEST + '/main.js',
        watch: SERVER_DIR.DEST
    });
});

gulp.task('client:browser-sync', () => {
	
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 7001,
    })

});

gulp.task('test', () => {
	return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('testone', () => {
	return gulp.src(['test_one/dev_api.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('default', [

			'client:clean',
			'client:webpack',
			'server:babel',
			
			'index:default',
			'writefs:default',
			'server:watch',
			
			'server:start',

			'client:browser-sync',
			
			], () => {

    gutil.log('Gulp is running');

});
