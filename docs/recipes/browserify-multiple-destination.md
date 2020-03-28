# Browserify + Globs (multiple destination)

This example shows how to set up a task of bundling multiple entry points into multiple destinations using browserify.

The below `js` task bundles all the `.js` files under `src/` as entry points and writes the results under `dest/`.


```js
var glup = require('glup');
var browserify = require('browserify');
var log = require('gluplog');
var tap = require('glup-tap');
var buffer = require('glup-buffer');
var sourcemaps = require('glup-sourcemaps');
var uglify = require('glup-uglify');

glup.task('js', function () {

  return glup.src('src/**/*.js', {read: false}) // no need of reading file because browserify does.

    // transform file objects using glup-tap plugin
    .pipe(tap(function (file) {

      log.info('bundling ' + file.path);

      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {debug: true}).bundle();

    }))

    // transform streaming contents into buffer contents (because glup-sourcemaps does not support streaming contents)
    .pipe(buffer())

    // load and init sourcemaps
    .pipe(sourcemaps.init({loadMaps: true}))

    .pipe(uglify())

    // write sourcemaps
    .pipe(sourcemaps.write('./'))

    .pipe(glup.dest('dest'));

});
```
