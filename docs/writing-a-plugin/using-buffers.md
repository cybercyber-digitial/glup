# Using buffers

> Here is some information on creating glup plugin that manipulates buffers.

[Writing a Plugin](README.md) > Using buffers

## Using buffers
If your plugin is relying on a buffer based library, you will probably choose to base your plugin around file.contents as a buffer. Let's implement a plugin prepending some text to files:

```js
var through = require('through2');
var PluginError = require('plugin-error');

// consts
const PLUGIN_NAME = 'glup-prefixer';

// plugin level function (dealing with files)
function glupPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // allocate ahead of time

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
    }

    // make sure the file goes through the next glup plugin
    this.push(file);

    // tell the stream engine that we are done with this file
    cb();
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = glupPrefixer;
```

The above plugin can be used like this:

```js
var glup = require('glup');
var glupPrefixer = require('glup-prefixer');

glup.src('files/**/*.js')
  .pipe(glupPrefixer('prepended string'))
  .pipe(glup.dest('modified-files'));
```

## Handling streams

Unfortunately, the above plugin will error when using glup.src in non-buffered (streaming) mode. You should support streams too if possible. See [Dealing with streams](dealing-with-streams.md) for more information.

## Some plugins based on buffers

* [glup-coffee](https://github.com/contra/glup-coffee)
* [glup-svgmin](https://github.com/ben-eb/glup-svgmin)
* [glup-marked](https://github.com/lmtm/glup-marked)
* [glup-svg2ttf](https://github.com/nfroidure/glup-svg2ttf)
