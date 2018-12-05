var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var rename = require('gulp-rename');
var minify = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var sassSrc = 'sass/**/*.scss';
var sassDest = 'public/css';

var onError = function (err) {
        notify.onError({
                title: "Gulp",
                subtitle: "Failure!",
                message: "Error: <%= error.message %>",
                sound: "Basso"
        })(err);
        this.emit('end');
};

var sassOptions = {
        outputStyle: 'expanded'
};

var prefixerOptions = {
        browsers: ['last 2 versions']
};

gulp.task('styles', function () {
        return gulp.src(sassSrc)
                .pipe(plumber({ errorHandler: onError }))
                .pipe(sourcemaps.init())
                .pipe(sass(sassOptions))
                .pipe(autoprefixer(prefixerOptions))
                .pipe(rename('main.css'))
                .pipe(gulp.dest(sassDest))
                .pipe(browserSync.stream())
                .pipe(minify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(browserSync.stream());
});

gulp.task('sass-lint', function () {
        gulp.src(sassSrc)
                .pipe(sassLint())
                .pipe(sassLint.format())
                .pipe(sassLint.failOnError());
});

gulp.task('watch', function () {
        gulp.watch(sassSrc, ['styles']);
        gulp.watch('**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['watch'], function () {
        browserSync.init({
                server: {
                        baseDir: "./"
                }
        });
});