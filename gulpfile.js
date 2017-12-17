const path = require('path');
const fs = require('fs');

const join = path.join;
const del = require('del');
const gulp = require('gulp');
const glob = require('glob');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const postCSS = require('gulp-postcss');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const manifest = require('gulp-appcache');
const notify = require('gulp-notify');
const autoPrefixer = require('autoprefixer');
const minify = require('cssnano');

const DEMO = 'demo';
const ICONS = 'node_modules/alfa-ui-primitives/icons';
const OUT = join(DEMO, 'out');

gulp.task('icons', () => gulp
  .src(join(ICONS, '**/*.svg'))
  .pipe(gulp.dest(ICONS))
  .pipe(gulp.dest(join(OUT, 'icons'))));

gulp.task('clean', () => del(join(OUT)));

gulp.task('templates', () => gulp.src(join(DEMO, 'src/demo.html')).pipe(gulp.dest(join(OUT))));

gulp.task('images', () => gulp.src(join(DEMO, 'src/*.svg')).pipe(gulp.dest(join(OUT))));

gulp.task('scripts', () => gulp
  .src(join(DEMO, 'src/*.js'))
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest(join(OUT))));

gulp.task('styles', () => {
  const processors = [autoPrefixer({ browsers: ['last 2 versions'] }), minify()];

  return gulp
    .src(join(DEMO, 'src/main.less'))
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'LESS',
        message: err.message,
      })),
    }))
    .pipe(less())
    .pipe(postCSS(processors))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(join(OUT)));
});

gulp.task('generateJSON', () => {
  const obj = {};
  obj.icons = [];

  const getAllIcons = (callback) => {
    glob(join(ICONS, '**/*.svg'), (err, files) => {
      let counter = 0;
      files
        .forEach((file, index, array) => {
          counter += 1;
          if (/svg/.test(file) !== false && !/_xs_|art_/.test(file)) {
            const icon = {};
            icon.name = path.basename(file);
            icon.category = path.basename(path.dirname(file));
            obj.icons.push(icon);
            if (counter === array.length) callback();
          }
        });
    });
  };

  getAllIcons(() => {
    const finalJSON = JSON.stringify(obj);
    fs.writeFile('demo/out/icons.json', finalJSON, err => (err ? console.log(err) : null));
  });
});

gulp.task('styles:sync', ['styles'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('templates:sync', ['templates'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('scripts:sync', ['scripts'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('run-server', () => {
  browserSync.init({
    server: {
      baseDir: '.',
    },
    startPath: './demo/out/demo.html',
  });
  gulp.watch(join(DEMO, '/src/*.html'), ['templates:sync']);
  gulp.watch(join(DEMO, '/src/*.js'), ['scripts:sync']);
  gulp.watch(join(DEMO, '/src/*.less'), ['styles:sync']);
});

gulp.task('default', () => {
  runSequence(
    'clean',
    'icons',
    'templates',
    'generateJSON',
    'scripts',
    'styles',
    'images',
    'run-server',
  );
});
