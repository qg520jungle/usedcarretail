var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var changed = require('gulp-changed');
var LessPluginCleanCSS = require('less-plugin-clean-css'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	cleancss = new LessPluginCleanCSS({
		advanced: true
	}),
	autoprefix = new LessPluginAutoPrefix({
		browsers: ["last 2 versions"]
	});
/* ------------ FILE PATH ------------ */
var filePath = {};
filePath.src = './src';
filePath.tmp = './.tmp/';
filePath.page = ['./*.html'];
filePath.js = ['./res/*.js'];
filePath.css = ['./res/*.css'];
filePath.less = ['./src/*.less'];
filePath.img = ['./res/icons/*.jpg', './res/icons/*.png'];


gulp.task('less', function() {
	return gulp.src(filePath.less)
		.pipe(less({
			plugins: [autoprefix, cleancss]
		}))
		.pipe(gulp.dest('./res/'));
});

gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: "./",
			directory: true
		}
	});

});
gulp.task('watch',function() {
	var _tmpArr = [].concat(filePath.page, filePath.less, filePath.css, filePath.js, filePath.img);
	gulp.watch(filePath.less,['less']);
	gulp.watch([].concat(filePath.page, filePath.css, filePath.js, filePath.img),['reload']);
});

gulp.task('reload',function() {
	browserSync.reload();
});

gulp.task('default', ['serve','less','watch']);
