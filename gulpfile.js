var
gulp = require('gulp'),
react = require('gulp-react'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
notify = require('gulp-notify'),
browserSync = require('browser-sync'),
reload = browserSync.reload;

// sass
gulp.task('sass', function () {
    gulp.src('./**/css/*.scss' , { base: 'css' })
        .pipe(sass().on('error', sass.logError))
        //添加前缀
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream: true}))
        .pipe(notify({ message: 'Styles task complete', sound: "Glass" }));
});


// react
gulp.task('react', function () {
    return gulp.src('./**/js/*.jsx', { base: 'js' })
        .pipe(react())
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'React task complete', sound: "Glass" }));
});


gulp.task('default', function() {

    browserSync.init({
        // files: "**",
        files: ["./**/*.html","./**/*.js"],

        // 动态站点
        // proxy: "localhost:8080/xph/index.action"

        // 静态站点
        server: {
            baseDir: "./",
            index: "index.html"
        }
    })


    gulp.watch('./**/*.scss', ['sass']);
    gulp.watch('./**/*.jsx', ['react']);
});
