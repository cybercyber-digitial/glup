# Pass arguments from the command line

```js
// npm install --save-dev glup glup-if glup-uglify minimist

var glup = require('glup');
var glupif = require('glup-if');
var uglify = require('glup-uglify');

var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

var options = minimist(process.argv.slice(2), knownOptions);

glup.task('scripts', function() {
  return glup.src('**/*.js')
    .pipe(glupif(options.env === 'production', uglify())) // only minify in production
    .pipe(glup.dest('dist'));
});
```

Then run glup with:

```sh
$ glup scripts --env development
```
