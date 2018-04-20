const path = require('path');

const Builder = require('gulp-bem-bundle-builder');
const bundler = require('gulp-bem-bundler-fs');

const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

const csso = require('gulp-csso');

const YENV = process.env.YENV || 'development';
const isProd = YENV === 'production';

const assets = 'app/assets/';

const builder = Builder({
    levels: [
        assets + 'touch-phone.blocks',
        assets + 'touch-pad.blocks',
        assets + 'desktop.blocks'
    ],
    techMap: {
        js: ['js'],
        css: ['css']
    }
});

gulp.task('build', () => {
    return bundler(assets + 'bundles/*')
        .pipe(builder({
            css: bundle =>
                bundle.src('css')
                    .pipe(concat(bundle.name + '.min.css'))
                    .pipe(gulpif(isProd, csso()))
                    .pipe(gulp.dest('public/css')),
            js: bundle =>
                bundle.src('js')
                    .pipe(concat(bundle.name + '.min.js'))
                    .pipe(gulpif(isProd, uglify()))
                    .pipe(gulp.dest('public/js')),
       }))
       .on('error', console.error)
       .pipe(debug());
});

gulp.task('default', gulp.series('build'));
