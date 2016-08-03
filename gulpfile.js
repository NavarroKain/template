var gulp = require('gulp'),
    // sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('stylus', function() {
    return gulp.src(['app/static/styl/*.styl', '!app/static/styl/_*.styl'])
        .pipe(stylus({
            'include css': true
        }))
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest('app/static/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('scripts', function() {
    return gulp.src([
            'app/static/libs/jquery/dist/jquery.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/static/js'));
});

gulp.task('csslibs', ['stylus'], function() {
    return gulp.src('app/static/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/static/css/'));
});

// Работа с jade
gulp.task('jade', function() {
    gulp.src('app/jade/pages/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch', ['browser-sync', 'csslibs', 'scripts'], function() {
    gulp.watch('app/static/styl/**/*.styl', ['stylus']);
    gulp.watch('app/jade/**/*.jade', ['jade']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/static/js/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('prodact');
});

gulp.task('img', function() {
    return gulp.src('app/static/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('prodact/static/img'));
});

gulp.task('build', ['clean', 'img', 'stylus', 'scripts'], function() {
    var buildCss = gulp.src([
            'app/static/css/main.css',
            'app/static/css/libs.min.css'
        ])
        .pipe(gulp.dest('prodact/static/css'));
    var buildFonts = gulp.src('app/static/fonts/**/*')
        .pipe(gulp.dest('prodact/static/fonts'));

    var buildJs = gulp.src('app/static/js/**/*')
        .pipe(gulp.dest('prodact/static/js'));

    var buildHtml = gulp.src('app/*html')
        .pipe(gulp.dest('prodact'));
});


gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
