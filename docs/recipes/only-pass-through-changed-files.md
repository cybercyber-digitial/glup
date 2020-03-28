# Only pass through changed files

Files are passed through the whole pipe chain on every run by default. By using [glup-changed](https://github.com/sindresorhus/glup-changed) only changed files will be passed through. This can speed up consecutive runs considerably.


```js
// npm install --save-dev glup glup-changed glup-jscs glup-uglify

var glup = require('glup');
var changed = require('glup-changed');
var jscs = require('glup-jscs');
var uglify = require('glup-uglify');

// we define some constants here so they can be reused
var SRC = 'src/*.js';
var DEST = 'dist';

glup.task('default', function() {
	return glup.src(SRC)
		// the `changed` task needs to know the destination directory
		// upfront to be able to figure out which files changed
		.pipe(changed(DEST))
		// only files that has changed will pass through here
		.pipe(jscs())
		.pipe(uglify())
		.pipe(glup.dest(DEST));
});
```
