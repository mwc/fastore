import gulp from "gulp"
import babel from "gulp-babel"
import rollup from "gulp-rollup"
import rename from "gulp-rename"
import mocha from "gulp-mocha"
import uglify from "gulp-uglify"

const { task, src, dest, series, watch } = gulp

task("rollup", function () {
    return src("./src/storage.js")
        .pipe(
            rollup({
                input: "./src/storage.js",
                output: {
                    format: "umd",
                    name: "fastore",
                },
            })
        )
        .pipe(rename('fastore.js'))
        .pipe(dest("./build", { file: 'fastore.js' }))
})

task("test", function () {
    return src(["./tests/**/*.js", "!./tests/**/*.spec.js"]).pipe(mocha())
})

task("test-watch", function () {
    watch(["./src/storage.js", "./tests/**/*.js", "!./tests/**/*.spec.js"], series("test"))
})

task("build", function () {
    return src("./build/fastore.js")
        .pipe(babel())
        .pipe(uglify())
        .pipe(dest("./dist"))
})

task("default", series("rollup", "build"))