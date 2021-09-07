const gulp = require("gulp")
const babel = require("gulp-babel")
const rollup = require("gulp-rollup")
const rename = require("gulp-rename")
const mocha = require("gulp-mocha")
const uglify = require("gulp-uglify")

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
    return src(["./tests/**/*.js", "!./tests/**/*.spec.js"]).pipe(mocha({
        timeout: 10000,
        require: "@babel/register",
    }))
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