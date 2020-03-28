# Mocha test-runner with glup

### Passing shared module in all tests

```js
// npm install glup glup-mocha

var glup = require('glup');
var mocha = require('glup-mocha');

glup.task('default', function() {
  return glup.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});
```

### Running mocha tests when files change

```js
// npm install glup glup-mocha gluplog

var glup = require('glup');
var mocha = require('glup-mocha');
var log = require('gluplog');

glup.task('mocha', function() {
    return glup.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', log.error);
});

glup.task('watch-mocha', function() {
    glup.watch(['lib/**', 'test/**'], glup.series('mocha'));
});
```
