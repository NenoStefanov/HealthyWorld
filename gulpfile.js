const gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp);


// clean
const del = require('del');

gulp.task('clean:dev', () => {
    return del(['./build/dev']);
});

gulp.task('clean', () => {
    return del(['./build/prod']);
});

// copy
const htmlreplace = require('gulp-html-replace'),
    cdns = require('./config').cdns;

gulp.task('copy:html', () => {
    return gulp.src('./src/client/index.html')
        .pipe(htmlreplace({
            'css-libs': [cdns.bootstrap.css],
            'js-libs': [
                cdns.jquery,
                cdns.sammy,
                cdns.bootstrap.js,
                cdns.rxjs,
                cdns.handlebars,
                cdns.bluebird,
                cdns.firebase.app,
                cdns.firebase.auth,
                cdns.firebase.database,
                cdns.firebase.storage
            ],
            'css-app': 'styles.min.css',
            'js-app': 'js/app.min.js'
        }))
        .pipe(gulp.dest('./build/prod'));
});

gulp.task('copy:templates', () => {
    return gulp.src('./src/client/templates/**/*.handlebars')
        .pipe(gulp.dest('./build/prod/templates'));
});

gulp.task('copy:fonts', () => {
    return gulp.src('./src/client/fonts/**/*.ttf')
        .pipe(gulp.dest('./build/prod/fonts'));
});

gulp.task('copy:images', () => {
    return gulp.src('./src/client/images/**/*.{png,gif,jpg}')
        .pipe(gulp.dest('./build/prod/images'));
});

gulp.task('copy', gulpsync.sync(['copy:html', 'copy:templates', 'copy:fonts', 'copy:images']));


// lint
const gulpStylelint = require('gulp-stylelint'),
    eslint = require('gulp-eslint');

gulp.task('lint:css', () => {
    return gulp.src('./src/client/styles/**/*.css')
        .pipe(gulpStylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
});

gulp.task('lint:js', () => {
    return gulp.src(['./src/client/scripts/**/*.js'])
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

gulp.task('compile:js:dev', () => {
    return browserify({ entries: './src/client/scripts/app.js', debug: true })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/dev'));
});

gulp.task('compile:js', () => {
    return browserify({ entries: './src/client/scripts/app.js', debug: true })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/prod/js'));
});

gulp.task('compile:css', () => {
    return gulp.src('./src/client/styles/**/*.css')
        .pipe(concatCss('styles.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./build/prod'));
});

gulp.task('compile:dev', ['compile:js:dev']);

gulp.task('compile', gulpsync.sync(['compile:js', 'compile:css']));


// build
gulp.task('build:dev', gulpsync.sync(['clean:dev', 'compile:dev']));

gulp.task('build', gulpsync.sync(['lint', 'clean', 'compile', 'copy']));


// serve
const gls = require('gulp-live-server');

gulp.task('serve:dev', ['build:dev'], () => {
    const server = gls.static(['.', './src/client'], 3000);
    server.start();
});

gulp.task('serve', ['build'], () => {
    const server = gls.static('./build/prod', 3000);
    server.start();
});