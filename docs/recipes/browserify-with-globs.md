# Browserify + Globs

[Browserify + Uglify2](https://github.com/glupjs/glup/blob/master/docs/recipes/browserify-uglify-sourcemap.md) shows how to setup a basic glup task to bundle a JavaScript file with its dependencies, and minify the bundle with UglifyJS while preserving source maps.
It does not, however, show how one may use glup and Browserify with multiple entry files.

See also: the [Combining Streams to Handle Errors](https://github.com/glupjs/glup/blob/master/docs/recipes/combining-streams-to-handle-errors.md) recipe for handling errors with Browserify or UglifyJS in your stream.

``` javascript
'use strict';

var browserify = require('browserify');
var glup = require('glup');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var log = require('gluplog');
var uglify = require('glup-uglify');
var sourcemaps = require('glup-sourcemaps');
var reactify = require('reactify');

glup.task('javascript', function () {
  // glup expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes glup plugins expect.
    .pipe(source('app.js'))
    // the rest of the glup task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add glup plugins to the pipeline here.
      .pipe(uglify())
      .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(glup.dest('./dist/js/'));

  // "globby" replaces the normal "glup.src" as Browserify
  // creates it's own readable stream.
  globby(['./entries/*.js']).then(function(entries) {
    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our glup pipeline.
    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    // ensure any errors from globby are handled
    bundledStream.emit('error', err);
  });

  // finally, we return the stream, so glup knows when this task is done.
  return bundledStream;
});
```
