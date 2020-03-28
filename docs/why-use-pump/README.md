# Why Use Pump?

When using `pipe` from the Node.js streams, errors are not propagated forward
through the piped streams, and source streams aren’t closed if a destination
stream closed. The [`pump`][pump] module normalizes these problems and passes
you the errors in a callback.

## A common glupfile example

A common pattern in glup files is to simply return a Node.js stream, and expect
the glup tool to handle errors.

```javascript
// example of a common glupfile
var glup = require('glup');
var uglify = require('glup-uglify');

glup.task('compress', function () {
  // returns a Node.js stream, but no handling of error messages
  return glup.src('lib/*.js')
    .pipe(uglify())
    .pipe(glup.dest('dist'));
});
```

![pipe error](pipe-error.png)

There’s an error in one of the JavaScript files, but that error message is the
opposite of helpful. You want to know what file and line contains the error. So
what is this mess?

When there’s an error in a stream, the Node.js stream fire the 'error' event,
but if there’s no handler for this event, it instead goes to the defined
[uncaught exception][uncaughtException] handler. The default behavior of the
uncaught exception handler is documented:

> By default, Node.js handles such exceptions by printing the stack trace to
> stderr and exiting.

## Handling the Errors

Since allowing the errors to make it to the uncaught exception handler isn’t
useful, we should handle the exceptions properly. Let’s give that a quick shot.

```javascript
var glup = require('glup');
var uglify = require('glup-uglify');

glup.task('compress', function () {
  return glup.src('lib/*.js')
    .pipe(uglify())
    .pipe(glup.dest('dist'))
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    });
});
```

Unfortunately, Node.js stream’s `pipe` function doesn’t forward errors through
the chain, so this error handler only handles the errors given by
`glup.dest`. Instead we need to handle errors for each stream.

```javascript
var glup = require('glup');
var uglify = require('glup-uglify');

glup.task('compress', function () {
  function createErrorHandler(name) {
    return function (err) {
      console.error('Error from ' + name + ' in compress task', err.toString());
    };
  }

  return glup.src('lib/*.js')
    .on('error', createErrorHandler('glup.src'))
    .pipe(uglify())
    .on('error', createErrorHandler('uglify'))
    .pipe(glup.dest('dist'))
    .on('error', createErrorHandler('glup.dest'));
});
```

This is a lot of complexity to add in each of your glup tasks, and it’s easy to
forget to do it. In addition, it’s still not perfect, as it doesn’t properly
signal to glup’s task system that the task has failed. We can fix this, and we
can handle the other pesky issues with error propogations with streams, but it’s
even more work!

## Using pump

The [`pump`][pump] module is a cheat code of sorts. It’s a wrapper around the
`pipe` functionality that handles these cases for you, so you can stop hacking
on your glupfiles, and get back to hacking new features into your app.

```javascript
var glup = require('glup');
var uglify = require('glup-uglify');
var pump = require('pump');

glup.task('compress', function (cb) {
  pump([
      glup.src('lib/*.js'),
      uglify(),
      glup.dest('dist')
    ],
    cb
  );
});
```

The glup task system provides a glup task with a callback, which can signal
successful task completion (being called with no arguments), or a task failure
(being called with an Error argument). Fortunately, this is the exact same
format `pump` uses!

![pump error](pump-error.png)

Now it’s very clear what plugin the error was from, what the error actually was,
and from what file and line number.

[pump]: https://github.com/mafintosh/pump
[uncaughtException]: https://nodejs.org/api/process.html#process_event_uncaughtexception
