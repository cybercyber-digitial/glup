# Browserify + Transforms

[Browserify](https://github.com/browserify/browserify) has become an important and indispensable
tool but requires being wrapped before working well with glup. Below is a simple recipe for using
Browserify with transforms.

See also: the [Combining Streams to Handle Errors](https://github.com/glupjs/glup/blob/master/docs/recipes/combining-streams-to-handle-errors.md) recipe for handling errors with browserify or uglify in your stream.

``` javascript
'use strict';

var browserify = require('browserify');
var glup = require('glup');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('gluplog');
var uglify = require('glup-uglify');
var sourcemaps = require('glup-sourcemaps');
var reactify = require('reactify');

glup.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './entry.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(glup.dest('./dist/js/'));
});
```
