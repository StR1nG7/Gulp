import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import sassCore from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCore);
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from'gulp-clean-css';
import rename from 'gulp-rename';
import babel from'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import del from 'del';
import browserSync from 'browser-sync';
const browsersync = browserSync.create();

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  }
}

export const clean = () => del(['dist/*', '!dist/img']);

export const html = () => gulp.src(paths.html.src)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream());

export const styles = () => gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(cleanCSS({level: 2}))
  .pipe(rename({basename: 'style', suffix: '.min'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())

export const scripts = () => gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('index.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())

export const img = () => gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin())
  .pipe(gulp.dest(paths.images.dest))
  .pipe(browsersync.stream())

const watch = () => {
  browsersync.init({
    server: {
        baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

export default gulp.series(clean, gulp.parallel(html, styles, scripts, img), watch)
