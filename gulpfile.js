var gulp    = require('gulp'),
    jasmine = require('gulp-jasmine-livereload-task');

gulp.task('default', jasmine({
    files: ['./src/**/*.js', './js/**/*.js', './spec/**/*.js']
}));