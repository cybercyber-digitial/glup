# Output both a minified and non-minified version

Outputting both a minified and non-minified version of your combined JavaScript files can be achieved by using `glup-rename` and piping to `dest` twice (once before minifying and once after minifying):

```js
'use strict';

var glup = require('glup');
var rename = require('glup-rename');
var uglify = require('glup-uglify');

var DEST = 'build/';

glup.task('default', function() {
  return glup.src('foo.js')
    // This will output the non-minified version
    .pipe(glup.dest(DEST))
    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(glup.dest(DEST));
});

```
