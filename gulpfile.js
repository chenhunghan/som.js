var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');

gulp.task('babel', function() {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/'));
});
