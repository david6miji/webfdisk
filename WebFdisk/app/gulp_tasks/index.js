'use strict';

import gulp 			from 'gulp';
import gutil 			from 'gulp-util';

import imagemin 		from 'gulp-imagemin';
import cleanCSS 		from 'gulp-clean-css';
import htmlmin 			from 'gulp-htmlmin';

import BS 				from 'browser-sync';

// let browserSync 	= BS.create();

const SRC = {
	JS		: CLIENT_DIR.SRC + '/js/*.js',
    LIB		: CLIENT_DIR.SRC + '/lib/**/*',
	CSS		: CLIENT_DIR.SRC + '/css/*.css',
    HTML	: [
	             CLIENT_DIR.SRC + '/**/*.html',
		   '!' + CLIENT_DIR.SRC + '/write_fs/*.html',
	          ],
    IMAGES	: CLIENT_DIR.SRC + '/img/*',
};

const DEST = {
	LIB		: CLIENT_DIR.DEST + '/lib',
    CSS		: CLIENT_DIR.DEST + '/css',
    HTML	: CLIENT_DIR.DEST + '/',
    IMAGES	: CLIENT_DIR.DEST + '/img',
};

gulp.task('index:lib', () => {
    return gulp.src(SRC.LIB)
          .pipe(gulp.dest(DEST.LIB))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('index:css', () => {
    return gulp.src(SRC.CSS)
           .pipe(cleanCSS({compatibility: 'ie8'}))
           .pipe(gulp.dest(DEST.CSS))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('index:images', () => {
    return gulp.src(SRC.IMAGES)
           .pipe(imagemin())
           .pipe(gulp.dest(DEST.IMAGES))
		   .pipe(browserSync.reload({stream : true}))
		   ;
});

gulp.task('index:html', () => {
    return gulp.src(SRC.HTML)
          .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST.HTML))
		  .pipe(browserSync.reload({stream : true}))
		  ;
});

gulp.task('index:watch', () => {
	
    let watcher = {
		
		webpack	: gulp.watch(SRC.JS, 		['client:webpack']),
        
 		lib		: gulp.watch(SRC.LIB, 		['index:lib']),
 		css		: gulp.watch(SRC.CSS, 		['index:css']),
// 		css		: gulp.watch(SRC.CSS, 		['index:css', 'client:webpack']),
        html	: gulp.watch(SRC.HTML, 		['index:html']),
        images	: gulp.watch(SRC.IMAGES, 	['index:images']),
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

gulp.task('index:default', [
			'index:lib',
			'index:css',
			'index:html',
			'index:images',
			'index:watch',
			], () => {

});
