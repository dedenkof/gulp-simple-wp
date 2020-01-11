const themename = 'devwp',
      version = 'complex'; // variants gulp pack complex default

const gulp = require('gulp'),
// Prepare and optimize code etc
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create(),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  jshint = require('gulp-jshint');
  concat = require('gulp-concat'),
  uglify   = require('gulp-uglify'),


// Only work with new or updated files

  newer = require('gulp-newer'),

// Name of working theme folder
  root = '../' + themename + '/',
  scss = root + 'sass/',
  js = root + 'js/',
  srcjs = root + 'srcjs/',
  languages = root + 'languages/';


// CSS via Sass and Autoprefixer

gulp.task('css', function() {
  return gulp.src(scss + '{style.scss,rtl.scss}')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      indentType: 'tab',
      indentWidth: '1'
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer('last 2 versions', '&gt; 1%')
    ]))
    .pipe(sourcemaps.write(scss + 'maps'))
    .pipe(gulp.dest(root));
});

// Deploy css via sass preprocessor
gulp.task('sass', () =>
  gulp.src('./style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}))
    //.pipe(autoprefixer({ browsers: autoprefixerList, cascade: false}))
    // .pipe(gcmq())
    //.pipe(concat('main.css'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(cleanCSS({level: 2}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({
      stream: true
    }))

);

// JavaScript

gulp.task('javascript', function() {
  return gulp.src([srcjs + '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(concat('theme.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js));
});




if (version == 'complex'){
  // Watch everything
  gulp.task('watch', function() {
    browserSync.init({
      open: 'external',
      proxy: 'http://localhost:8888/newwp/',
      port: 8080
    });

    gulp.watch([root + '**/*.css', root + '**/*.scss' ], ['css']);
    gulp.watch(srcjs + '**/*.js', ['javascript']);
    gulp.watch(root + '**/*').on('change', browserSync.reload);
  });


// Default task (runs at initiation: gulp --verbose)
  gulp.task('default', gulp.parallel('watch'));

}else{

  gulp.task('watch', function() {
    browserSync.init({
      open: 'external',
      proxy: 'http://localhost:8888/newwp/',
      port: 8080
    });

      gulp.watch('./*.scss').on('change', browserSync.reload);

  });

  gulp.task('default', gulp.parallel('watch'));


}