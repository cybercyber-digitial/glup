# Generating a file per folder

If you have a set of folders, and wish to perform a set of tasks on each, for instance...

```
/scripts
/scripts/jquery/*.js
/scripts/angularjs/*.js
```

...and want to end up with...

```
/scripts
/scripts/jquery.min.js
/scripts/angularjs.min.js
```

...you'll need to do something like the following...

``` javascript
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var glup = require('glup');
var concat = require('glup-concat');
var rename = require('glup-rename');
var uglify = require('glup-uglify');

var scriptsPath = 'src/scripts';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

glup.task('scripts', function(done) {
   var folders = getFolders(scriptsPath);
   if (folders.length === 0) return done(); // nothing to do!
   var tasks = folders.map(function(folder) {
      return glup.src(path.join(scriptsPath, folder, '/**/*.js'))
        // concat into foldername.js
        .pipe(concat(folder + '.js'))
        // write to output
        .pipe(glup.dest(scriptsPath))
        // minify
        .pipe(uglify())
        // rename to folder.min.js
        .pipe(rename(folder + '.min.js'))
        // write to output again
        .pipe(glup.dest(scriptsPath));
   });

   // process all remaining files in scriptsPath root into main.js and main.min.js files
   var root = glup.src(path.join(scriptsPath, '/*.js'))
        .pipe(concat('main.js'))
        .pipe(glup.dest(scriptsPath))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(glup.dest(scriptsPath));

   return merge(tasks, root);
});
```

A few notes:

- `folders.map` - executes the function once per folder, and returns the async stream
- `merge` - combines the streams and ends only when all streams emitted end
