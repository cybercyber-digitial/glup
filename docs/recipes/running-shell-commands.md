# Running Shell Commands

Sometimes it is helpful to be able to call existing command line tools from glup.

There are 2 ways to handle this: node's [`child_process`](https://nodejs.org/api/child_process.html)
built-in module or [`glup-exec`](https://github.com/robrich/glup-exec) if you need to integrate the
command with an existing pipeline.

```js
'use strict';

var cp = require('child_process');
var glup = require('glup');

glup.task('reset', function() {
  // In glup 4, you can return a child process to signal task completion
  return cp.execFile('git checkout -- .');
});
```

```js
'use strict';

var glup = require('glup');
var exec = require('glup-exec');

glup.task('reset', function() {
  return glup.src('./**/**')
    .pipe(exec('git checkout -- <%= file.path %>'));
});
```
