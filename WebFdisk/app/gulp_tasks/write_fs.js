'use strict';

import gulp 			from 'gulp';
import gutil 			from 'gulp-util';

import imagemin 		from 'gulp-imagemin';
import cleanCSS 		from 'gulp-clean-css';
import htmlmin 			from 'gulp-htmlmin';

import BS 				from 'browser-sync';

// let browserSync 	= BS.create();

const SRC = {
    LIB		: CLIENT_DIR.SRC + '/write_fs/lib/**/*',
	CSS		: CLIENT_DIR.SRC + '/write_fs/css/*.css',
    IMAGES	: CLIENT_DIR.SRC + '/write_fs/img/*',
    HTML	: CLIENT_DIR.SRC + '/write_fs/**/*.html',
	JS		: CLIENT_DIR.SRC + '/write_fs/**/*.js',
};

const DEST = {
	LIB		: CLIENT_DIR.DEST + '/write_fs/lib',
    CSS		: CLIENT_DIR.DEST + '/write_fs/css',
    IMAGES	: CLIENT_DIR.DEST + '/write_fs/img',
    HTML	: CLIENT_DIR.DEST + '/write_fs/',
};

gulp.task('writefs:lib', () => {
    return gulp.src(SRC.LIB)
          .pipe(gulp.dest(DEST.LIB))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('writefs:css', () => {
    return gulp.src(SRC.CSS)
           .pipe(cleanCSS({compatibility: 'ie8'}))
           .pipe(gulp.dest(DEST.CSS))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('writefs:images', () => {
    return gulp.src(SRC.IMAGES)
           .pipe(imagemin())
           .pipe(gulp.dest(DEST.IMAGES))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('writefs:html', () => {
    return gulp.src(SRC.HTML)
          .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST.HTML))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('writefs:watch', () => {
	
    let watcher = {
		
		webpack	: gulp.watch(SRC.JS, 		['client:webpack']),
        
 		lib		: gulp.watch(SRC.LIB, 		['writefs:lib']),
 		css		: gulp.watch(SRC.CSS, 		['writefs:css']),
// 		css		: gulp.watch(SRC.CSS, 		['writefs:css', 'client:webpack']),
        html	: gulp.watch(SRC.HTML, 		['writefs:html']),
        images	: gulp.watch(SRC.IMAGES, 	['writefs:images']),
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

gulp.task('writefs:default', [
			'writefs:lib',
			'writefs:css',
			'writefs:html',
			'writefs:images',
			'writefs:watch',
			], () => {

});
