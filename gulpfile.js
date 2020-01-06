var gulp = require('gulp'),
  sass = require('gulp-sass'); //Подключаем Sass пакет
var browserSync = require('browser-sync'); // Подключаем Browser Sync
var autoprefixer = require('gulp-autoprefixer');
var cssnano     = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
var rename      = require('gulp-rename');
const tinypng = require('gulp-tinypng');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', gulp.parallel('sass'));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browser Sync
    server: { // Определяем параметры сервера
      baseDir: './' // Директория для сервера - ./
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('sass', function(){ // Создаем таск "sass"
  return gulp.src('scss/**/*.scss') // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer(
      ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      { cascade: true })) // Создаем префиксы
    .pipe(gulp.dest('css/')) // Выгружаем результата в папку css
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('run', gulp.parallel('sass', 'browser-sync', 'watch'));

gulp.task('tinypng', function(e) {
  return gulp.src(['img/**/*.png', 'img/**/*.jpg'])
    .pipe(tinypng('eGwHsgRHgRYLa2syNI121TJRmNwb7J46'))
    .pipe(gulp.dest('img/'));
});

gulp.task('css-min', function() {
  return gulp.src('scss/style.scss') // Выбираем файл для минификации
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer(
      ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      { cascade: true })) // Создаем префиксы
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    .pipe(gulp.dest('css/')); // Выгружаем в папку css
});

gulp.task('build', gulp.parallel('css-min','tinypng')); //Ура :)


gulp.task('sprite', function() {
  let spriteData = gulp.src('img/sprite/*.png')
    .pipe(spritesmith({ // настройка спрайта
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      imgPath: '../img/sprite.png'
    }));

  let imgStream = spriteData.img
    .pipe(gulp.dest('img/'));

  let cssStream = spriteData.css
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css/'));
    return merge(imgStream, cssStream);
});