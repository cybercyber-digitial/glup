# Combining streams to handle errors

By default, emitting an error on a stream will cause it to be thrown unless it already has a listener attached to the `error` event. This gets a bit tricky when you're working with longer pipelines of streams.

By using [stream-combiner2](https://github.com/substack/stream-combiner2) you can turn a series of streams into a single stream, meaning you only need to listen to the `error` event in one place in your code.

Here's an example of using it in a glupfile:

```js
var combiner = require('stream-combiner2');
var uglify = require('glup-uglify');
var glup = require('glup');

glup.task('test', function() {
  return combiner.obj([
      glup.src('bootstrap/js/*.js'),
      uglify(),
      glup.dest('public/bootstrap')
    ])
    // any errors in the above streams will get caught
    // by this listener, instead of being thrown:
    .on('error', console.error.bind(console));
});
```
