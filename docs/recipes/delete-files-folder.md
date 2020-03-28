# Delete files and folders

You might want to delete some files before running your build. Since deleting files doesn't work on the file contents, there's no reason to use a glup plugin. An excellent opportunity to use a vanilla node module.

Let's use the [`del`](https://github.com/sindresorhus/del) module for this example as it supports multiple files and [globbing](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev glup del
```

Imagine the following file structure:

```
.
├── dist
│   ├── report.csv
│   ├── desktop
│   └── mobile
│       ├── app.js
│       ├── deploy.json
│       └── index.html
└── src
```

In the glupfile we want to clean out the contents of the `mobile` folder before running our build:

```js
var glup = require('glup');
var del = require('del');

glup.task('clean:mobile', function () {
  return del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/mobile/**/*',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});

glup.task('default', glup.series('clean:mobile'));
```


## Delete files in a pipeline

You might want to delete some files after processing them in a pipeline.

We'll use [vinyl-paths](https://github.com/sindresorhus/vinyl-paths) to easily get the file path of files in the stream and pass it to the `del` method.

```sh
$ npm install --save-dev glup del vinyl-paths
```

Imagine the following file structure:

```
.
├── tmp
│   ├── rainbow.js
│   └── unicorn.js
└── dist
```

```js
var glup = require('glup');
var stripDebug = require('glup-strip-debug'); // only as an example
var del = require('del');
var vinylPaths = require('vinyl-paths');

glup.task('clean:tmp', function () {
  return glup.src('tmp/*')
    .pipe(vinylPaths(del))
    .pipe(stripDebug())
    .pipe(glup.dest('dist'));
});

glup.task('default', glup.series('clean:tmp'));
```

This will only delete the tmp dir.


Only do this if you're already using other plugins in the pipeline, otherwise just use the module directly as `glup.src` is costly.
