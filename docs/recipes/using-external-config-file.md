# Using external config file

Beneficial because it's keeping tasks DRY and config.json can be used by another task runner, like `grunt`.

-

###### `config.json`

```json
{
  "desktop" : {
    "src" : [
      "dev/desktop/js/**/*.js",
      "!dev/desktop/js/vendor/**"
    ],
    "dest" : "build/desktop/js"
  },
  "mobile" : {
    "src" : [
      "dev/mobile/js/**/*.js",
      "!dev/mobile/js/vendor/**"
    ],
    "dest" : "build/mobile/js"
  }
}
```

-

###### `glupfile.js`

```js
// npm install --save-dev glup glup-uglify merge-stream
var glup = require('glup');
var uglify = require('glup-uglify');
var merge = require('merge-stream');

var config = require('./config.json');

function doStuff(cfg) {
  return glup.src(cfg.src)
    .pipe(uglify())
    .pipe(glup.dest(cfg.dest));
}

glup.task('dry', function() {
  // return a stream to signal completion
  return merge([
    doStuff(config.desktop),
    doStuff(config.mobile)
  ])
});
```
