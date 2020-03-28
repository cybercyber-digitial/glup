# Incremental rebuilding, including operating on full file sets

The trouble with incremental rebuilds is you often want to operate on _all_ processed files, not just single files. For example, you may want to lint and module-wrap just the file(s) that have changed, then concatenate it with all other linted and module-wrapped files. This is difficult without the use of temp files.

Use [glup-cached](https://github.com/wearefractal/glup-cached) and [glup-remember](https://github.com/ahaurw01/glup-remember) to achieve this.

```js
var glup = require('glup');
var header = require('glup-header');
var footer = require('glup-footer');
var concat = require('glup-concat');
var jshint = require('glup-jshint');
var cached = require('glup-cached');
var remember = require('glup-remember');

var scriptsGlob = 'src/**/*.js';

glup.task('scripts', function() {
  return glup.src(scriptsGlob)
      .pipe(cached('scripts'))        // only pass through changed files
      .pipe(jshint())                 // do special things to the changed files...
      .pipe(header('(function () {')) // e.g. jshinting ^^^
      .pipe(footer('})();'))          // and some kind of module wrapping
      .pipe(remember('scripts'))      // add back all files to the stream
      .pipe(concat('app.js'))         // do things that require all files
      .pipe(glup.dest('public/'));
});

glup.task('watch', function () {
  var watcher = glup.watch(scriptsGlob, glup.series('scripts')); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.scripts[event.path];       // glup-cached remove api
      remember.forget('scripts', event.path);         // glup-remember remove api
    }
  });
});
```
