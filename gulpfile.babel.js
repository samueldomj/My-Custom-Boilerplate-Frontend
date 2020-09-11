import gulp from 'gulp'
import plumber from 'gulp-plumber'
import browserSync from 'browser-sync'
import pug from 'gulp-pug'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import babel from 'gulp-babel'
import imagemin from 'gulp-imagemin'

const server = browserSync.create()

const postcssPlugins = [
    cssnano(),
    autoprefixer()
]

// Scss
gulp.task('styles', () => {
    return gulp.src('./src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('./public/css'))
        .pipe(server.stream())
})

// Pug
gulp.task('pug', () => {
    return gulp.src('./src/pug/pages/*.pug')
        .pipe(pug({
            pretty: true,
            basedir: './src/pug'
        }))
        .pipe(gulp.dest('./public'))
})

// Js
gulp.task('js', () => {
    return gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./public/js'))
        .pipe(server.stream())
})

gulp.task('images', () => {
    return gulp.src('./public/images/**/**')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('./public/images'))
})

gulp.task('default', () => {
    server.init({
        server: './public'
    })

    // HTML
    gulp.watch('./src/pug/**/*.pug', gulp.series('pug')).on('change', server.reload)

    // Scss
    gulp.watch('./src/scss/**/*.scss', gulp.series('styles'))

    // Js
    gulp.watch('./src/js/*.js', gulp.series('js')).on('change', server.reload)
})
