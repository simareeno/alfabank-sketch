const path = require('path'),
  fs = require('fs'),
  join = path.join,
  del = require('del'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  svgmin = require('gulp-svgmin'),
  insert = require('gulp-insert'),
  replace = require('gulp-replace'),
  concat = require('gulp-concat'),
  cheerio = require('gulp-cheerio'),
  babel = require('gulp-babel'),
  runSequence = require('run-sequence'),
  webpack = require('webpack-stream'),
  browserSync = require('browser-sync').create(),
  postCSS = require('gulp-postcss'),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  manifest = require('gulp-appcache'),
  notify = require('gulp-notify'),
  autoPrefixer = require('autoprefixer'),
  minify = require('cssnano'),
  glob = require('glob-fs')({ gitignore: true }),
  DEMO = 'demo',
  ICONS = 'icons';
OUT = join(DEMO, 'out');

gulp.task('icons', function() {
  return gulp
    .src(join(ICONS, '**/*.svg'))
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true // Убираем заголовки
          },
          {
            removeDesc: true // и описания
          },
          {
            sortAttrs: true // сортируем аттрибуты для наглядности
          },
          {
            removeStyleElement: true // на всякий случай убираем тэги <style>
          },
          {
            removeScriptElement: true // и <script>
          }
        ]
      })
    )
    .pipe(gulp.dest(ICONS))
    .pipe(gulp.dest(join(OUT, 'icons')));
});

gulp.task('clean', function() {
  return del(join(OUT));
});

gulp.task('templates', function() {
  return gulp.src(join(DEMO, 'src/demo.html')).pipe(gulp.dest(join(OUT)));
});

gulp.task('images', function() {
  return gulp.src(join(DEMO, 'src/*.svg')).pipe(gulp.dest(join(OUT)));
});

gulp.task('scripts', function() {
  return gulp
    .src(join(DEMO, 'src/*.js'))
    .pipe(
      babel({
        presets: ['es2015']
      })
    )
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(join(OUT)));
});

gulp.task('manifest', function() {
  return gulp
    .src(['demo/out/**/*'])
    .pipe(
      manifest({
        hash: true,
        preferOnline: true,
        network: ['http://*', 'https://*', '*'],
        filename: 'cache.manifest',
        exclude: 'cache.manifest'
      })
    )
    .pipe(gulp.dest('demo/out'));
});

gulp.task('styles', function() {
  let processors = [autoPrefixer({ browsers: ['last 2 versions'] }), minify()];

  return gulp
    .src(join(DEMO, 'src/main.less'))
    .pipe(
      plumber({
        errorHandler: notify.onError(function(err) {
          return {
            title: 'LESS',
            message: err.message
          };
        })
      })
    )
    .pipe(less())
    .pipe(postCSS(processors))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(join(OUT)));
});

gulp.task('generateJSON', function() {
  let iconsFolder = 'icons';
  var obj = {};
  obj['icons'] = [];

  function getAllIcons(callback) {
    fs.readdir(iconsFolder, (err, files) => {
      let counter = 0;
      files.forEach((file, index, array) => {
        fs.stat(iconsFolder + '/' + file, function(err, stats) {
          if (stats.isDirectory()) {
            let folderName = file;

            let iconsFromFoler = fs
              .readdirSync(iconsFolder + '/' + folderName)
              .filter(function(a) {
                return /svg/.test(a);
              });

            iconsFromFoler.forEach(file => {
              let icon = {};
              icon.name = path.basename(file);
              icon.category = folderName;
              obj['icons'].push(icon);
            });
          }

          counter++;
          if (counter === array.length) {
            callback();
          }
        });
      });
    });
  }

  getAllIcons(function() {
    finalJSON = JSON.stringify(obj);

    fs.writeFile('demo/out/icons.json', finalJSON, function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

gulp.task('styles:sync', ['styles'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('templates:sync', ['templates'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('scripts:sync', ['scripts'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('run-server', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    startPath: './demo/out/demo.html'
  });
  gulp.watch(join(DEMO, '/src/*.html'), ['templates:sync']);
  gulp.watch(join(DEMO, '/src/*.js'), ['scripts:sync']);
  gulp.watch(join(DEMO, '/src/*.less'), ['styles:sync']);
});

gulp.task('default', function() {
  runSequence(
    'clean',
    'icons',
    'templates',
    'generateJSON',
    'scripts',
    'styles',
    'images',
    'manifest',
    'run-server'
  );
});
