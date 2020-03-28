# Sharing streams with stream factories

If you use the same plugins in multiple tasks you might find yourself getting that itch to DRY things up. This method will allow you to create factories to split out your commonly used stream chains.

We'll use [lazypipe](https://github.com/OverZealous/lazypipe) to get the job done.

This is our sample file:

```js
var glup = require('glup');
var uglify = require('glup-uglify');
var coffee = require('glup-coffee');
var jshint = require('glup-jshint');
var stylish = require('jshint-stylish');

glup.task('bootstrap', function() {
  return glup.src('bootstrap/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(glup.dest('public/bootstrap'));
});

glup.task('coffee', function() {
  return glup.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(glup.dest('public/js'));
});
```

and our file after using lazypipe looks like this:

```js
var glup = require('glup');
var uglify = require('glup-uglify');
var coffee = require('glup-coffee');
var jshint = require('glup-jshint');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');

// give lazypipe
var jsTransform = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(uglify);

glup.task('bootstrap', function() {
  return glup.src('bootstrap/js/*.js')
    .pipe(jsTransform())
    .pipe(glup.dest('public/bootstrap'));
});

glup.task('coffee', function() {
  return glup.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jsTransform())
    .pipe(glup.dest('public/js'));
});
```

You can see we split out our JavaScript pipeline (JSHint + Uglify) that was being reused in multiple tasks into a factory. These factories can be reused in as many tasks as you want. You can also nest factories and you can chain factories together for great effect. Splitting out each shared pipeline also gives you one central location to modify if you decide to change up your workflow.
