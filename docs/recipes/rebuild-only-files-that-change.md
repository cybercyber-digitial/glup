# Rebuild only files that change

With [`glup-watch`](https://github.com/floatdrop/glup-watch):

```js
var glup = require('glup');
var sass = require('glup-sass');
var watch = require('glup-watch');

glup.task('default', function() {
  return glup.src('sass/*.scss')
    .pipe(watch('sass/*.scss'))
    .pipe(sass())
    .pipe(glup.dest('dist'));
});
```
