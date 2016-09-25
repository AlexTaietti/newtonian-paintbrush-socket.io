//import stuff
var gulp  = require('gulp');
var sass  = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var prefix = require('gulp-autoprefixer');

gulp.task('js', function(){
	return gulp.src('src/es/*.js')
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest('public/js'));
});

gulp.task('css', function(){
	return gulp.src('src/sass/*.scss')
		.pipe(sass())
		.pipe(prefix())
		.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function(){
	gulp.watch( 'src/es/*.js', ['js'] );
	gulp.watch( 'src/sass/*.scss', ['css'] );
});