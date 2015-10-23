// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp = require("gulp"),
	util = require("gulp-util"),
	uglify = require("gulp-uglify"),
	jsvalidate = require("gulp-jsvalidate"),
	jasmine = require("gulp-jasmine"),
	concat = require("gulp-concat"),
	coverage = require("gulp-coverage"),
	minifyCSS = require("gulp-minify-css");

gulp.task("uglifyScripts", function() {
	return gulp.src([
			"Scripts/jquery-1.9.1.js",
			"Scripts/jquery.signalR-2.2.0.js",
			"Scripts/angular.js",
			"Scripts/angular-route.js",
            "Scripts/angular-animate.js",
            "Scripts/truncate.js",
			"Scripts/angular-ui/ui-bootstrap.js",
			"Scripts/angular-ui/ui-bootstrap-tpls.js",
			"Scripts/bootstrap.js",
			"Scripts/underscore.js",
			"Scripts/underscore.string.js",
			"Scripts/bootstrap-notify/bootstrap-notify.js",
			"Scripts/FileSaver.js"
		])
		.pipe(concat("scripts.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("concatScripts", function () {
    return gulp.src([
			"Scripts/jquery-1.9.1.js",
			"Scripts/jquery.signalR-2.2.0.js",
			"Scripts/angular.js",
            "Scripts/angular-mocks.js",
            "Scripts/angular-route.js",
            "Scripts/angular-animate.js",
            "Scripts/truncate.js",
			"Scripts/angular-ui/ui-bootstrap.js",
			"Scripts/angular-ui/ui-bootstrap-tpls.js",
			"Scripts/bootstrap.js",
			"Scripts/underscore.js",
			"Scripts/underscore.string.js",
			"Scripts/bootstrap-notify/bootstrap-notify.js",
			"Scripts/FileSaver.js",
            "app/app.js",
            "!Scripts/jasmine/*.js",
            "!Scripts/blanked/*.js"
    ])
		.pipe(concat("scriptsForTests.js"))
        .pipe(uglify())
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("concatAdditionalFiles", function () {
    return gulp.src([
			"app/Common/angular-md5.js",
            "app/Operator/directives/dndLists.js",
            "app/Operator/directives/focusMe.js"
    ])
		.pipe(concat("additionalFiles.js"))
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("uglifyApp", function() {
	return gulp.src([
			"app/**/*.js",
			"!app/UnitTests/**/*.js"
		])
		.pipe(concat("app.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("concatApp", function () {
    return gulp.src([
			"app/**/*.js",
			"!app/UnitTests/**/*.js"
    ])
		.pipe(concat("app.debug.js"))
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("concatAppTests", function() {
	return gulp.src([
			"app/**/*.js",
            "!app/app.js",
			"!app/UnitTests/**/*.js",
            "!app/Operator/directives/dndLists.js",
            "!app/Operator/directives/focusMe.js",
            "!app/Common/angular-md5.js"
		])
		.pipe(concat("appForTests.js"))
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("concatTests", function() {
	return gulp.src([
			"app/UnitTests/**/*.js"
		])
		.pipe(concat("unitTests.js"))
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("uglifyPrompter", function() {
	return gulp.src([
			"app/Prompter/**/*.js"
		])
		.pipe(concat("prompter.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("Scripts/min"));
});

gulp.task("uglifyStyles", function() {
	return gulp.src([
			"Content/**/*.css",
			"!Content/**/*.min.css"
		])
		.pipe(concat("styles.min.css"))
		.pipe(minifyCSS())
		.pipe(gulp.dest("Content"));
});

//JS code validation
gulp.task("validate", function () {
    return gulp.src("app/**/*.js")
        .pipe(jsvalidate());
});

gulp.task("default", [
    "validate",
	"uglifyScripts",
	"uglifyApp",
    "concatAppTests",
    "concatAdditionalFiles",
	"concatApp",
    "concatScripts",
    "concatTests",
	"uglifyPrompter",
	"uglifyStyles"
]);