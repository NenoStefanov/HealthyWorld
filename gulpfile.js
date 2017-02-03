const gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp);


// clean
const del = require('del');

gulp.task('clean', () => {
    return del(['build']);
});


// copy
const htmlreplace = require('gulp-html-replace'),
    cdns = require('./config').cdns;

gulp.task('copy:html', () => {
    return gulp.src('index.html')
        .pipe(htmlreplace({
            'css-libs': [cdns.bootstrapCSS],
            'js-libs': [cdns.jquery, cdns.bootstrapJS, cdns.sammy],
            'css-app': 'styles.min.css',
            'js-app': 'js/app.min.js'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('copy', gulpsync.sync(['copy:html']));


// lint
const gulpStylelint = require('gulp-stylelint'),
    eslint = require('gulp-eslint');

gulp.task('lint:css', () => {
    return gulp.src('src/client/styles/*.css')
        .pipe(gulpStylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
});

gulp.task('lint:js', () => {
    return gulp.src(['src/client/scripts/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:css', 'lint:js']);


// compile
const browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css');

gulp.task('compile:js', () => {
    return browserify({ entries: './src/client/scripts/app.js', debug: true })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('compile:css', () => {
    return gulp.src('./src/client/styles/**/*.css')
        .pipe(concatCss('styles.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('build'));
});

gulp.task('compile', gulpsync.sync(['compile:js', 'compile:css']));


// build
gulp.task('build', gulpsync.sync(['lint', 'clean', 'compile', 'copy']));


// serve
const gls = require('gulp-live-server');

gulp.task('serve:dev', ['build'], () => {
    const server = gls.static('.', 3000);
    server.start();
});

gulp.task('serve:prod', ['build'], () => {
    const server = gls.static('./build', 3000);
    server.start();
});