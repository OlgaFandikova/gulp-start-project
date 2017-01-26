var gulp = require('gulp');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var short = require('postcss-short');
var sass = require('gulp-sass');
var pixtorem  = require('postcss-pxtorem');
var svgFragments  = require('postcss-svg-fragments');
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');

// используем препроцессор sass и постпроцессор postcss
gulp.task('css', function () {
    var processors = [
        cssnext, cssnano, short,
        pixtorem({
            propWhiteList: ['font-size', 'line-height'] // переводит указанные параметры в rem
        }),
        svgFragments
    ];
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(concatCss("style.css"))
        .pipe(postcss(processors))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('css/'));
});

// следим за изменением файлов и автоматически вызываем задачи
gulp.task('watch', function () {
    gulp.watch('sass/*.scss', function () {
        gulp.run('css');
    });
    gulp.watch('sass/lib/*.scss', function () {
        gulp.run('css');
    });
    gulp.watch('img/icons/*.svg', function () {
        gulp.run('svg');
    })
});

// формирование svg спрайта
gulp.task('svg', function () {
    return gulp.src('img/icons/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            // используйте, если Вам нужно очищать svg от каких-либо атрибутов
            // run: function ($) {
            //     $('[fill]').removeAttr('fill');
            //     $('[style]').removeAttr('style');
            // },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
                mode: {symbol: true},
                preview: false
            }
        ))
        .pipe(gulp.dest('img'));
});


