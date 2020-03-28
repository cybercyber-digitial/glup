# Dealing with streams

> It is highly recommended to write plugins supporting streams. Here is some information on creating a glup plugin that supports streams.

> Make sure to follow the best practices regarding error handling and add a line that makes the glup plugin re-emit the first error caught during the transformation of the content.

[Writing a Plugin](README.md) > Writing stream based plugins

## Dealing with streams

Let's implement a plugin prepending some text to files. This plugin supports all possible forms of `file.contents`.

```js
var through = require('through2');
var PluginError = require('plugin-error');

// consts
const PLUGIN_NAME = 'glup-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// plugin level function (dealing with files)
function glupPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // allocate ahead of time

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // define the streamer that will transform the content
      var streamer = prefixStream(prefixText);
      // catch errors from the streamer and emit a glup plugin error
      streamer.on('error', this.emit.bind(this, 'error'));
      // start the transformation
      file.contents = file.contents.pipe(streamer);
    }

    // make sure the file goes through the next glup plugin
    this.push(file);
    // tell the stream engine that we are done with this file
    cb();
  });

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = glupPrefixer;
```

The above plugin can be used like this:

```js
var glup = require('glup');
var glupPrefixer = require('glup-prefixer');

glup.src('files/**/*.js', { buffer: false })
  .pipe(glupPrefixer('prepended string'))
  .pipe(glup.dest('modified-files'));
```

## Some plugins using streams

* [glup-svgicons2svgfont](https://github.com/nfroidure/glup-svgiconstosvgfont)
