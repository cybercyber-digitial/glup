# Using multiple sources in one task

```js
// npm install --save-dev glup merge-stream

var glup = require('glup');
var merge = require('merge-stream');

glup.task('test', function() {
  var bootstrap = glup.src('bootstrap/js/*.js')
    .pipe(glup.dest('public/bootstrap'));

  var jquery = glup.src('jquery.cookie/jquery.cookie.js')
    .pipe(glup.dest('public/jquery'));

  return merge(bootstrap, jquery);
});
```

`glup.src` will emit files in the order they were added:

```js
// npm install glup glup-concat

var glup = require('glup');
var concat = require('glup-concat');

glup.task('default', function() {
  return glup.src(['foo/*', 'bar/*'])
    .pipe(concat('result.txt'))
    .pipe(glup.dest('build'));
});
