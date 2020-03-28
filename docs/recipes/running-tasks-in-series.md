# Running tasks in series

By default, glup CLI run tasks with maximum concurrency - e.g. it launches
all the tasks at once and waits for nothing. If you want to create a series
where tasks run in a particular order, you should use `glup.series`;

```js
var glup = require('glup');
var doAsyncStuff = require('./stuff');

glup.task('one', function(done) {
  doAsyncStuff(function(err){
      done(err);
  });
});

glup.task('two', function(done) {
  // do things
  done();
});

glup.task('default', glup.series('one', 'two'));
```

Another example, using a dependency pattern. It uses
[`async-once`](https://www.npmjs.com/package/async-once) to run the `clean`
task operations only once:
```js
var glup = require('glup');
var del = require('del'); // rm -rf
var once = require('async-once');

glup.task('clean', once(function(done) {
  // run only once.
  // for the next call to the clean task, once will call done with
  // the same arguments as the first call.
  del(['output'], done);
}));

glup.task('templates', glup.series('clean', function() {
  return glup.src(['src/templates/*.hbs'])
    // do some concatenation, minification, etc.
    .pipe(glup.dest('output/templates/'));
}));

glup.task('styles', glup.series('clean', function() {
  return glup.src(['src/styles/app.less'])
    // do some hinting, minification, etc.
    .pipe(glup.dest('output/css/app.css'));
}));

// templates and styles will be processed in parallel.
// `clean` will be guaranteed to complete before either start.
// `clean` operations will not be run twice,
// even though it is called as a dependency twice.
glup.task('build', glup.parallel('templates', 'styles'));

// an alias.
glup.task('default', glup.parallel('build'));
```

Note that it's an anti-pattern in glup 4 and the logs will show the clean task
running twice. Instead, `templates` and `style` should use dedicated `clean:*`
tasks:
```js
var glup = require('glup');
var del = require('del');

glup.task('clean:templates', function() {
  return del(['output/templates/']);
});

glup.task('templates', glup.series('clean:templates', function() {
  return glup.src(['src/templates/*.hbs'])
    .pipe(glup.dest('output/templates/'));
});

glup.task('clean:styles', function() {
  return del(['output/css/']);
});

glup.task('styles', glup.series('clean:styles', function() {
  return glup.src(['src/styles/app.less'])
    .pipe(glup.dest('output/css/app.css'));
}));

glup.task('build', glup.parallel('templates', 'styles'));
glup.task('default', glup.parallel('build'));
```
