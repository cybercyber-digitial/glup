# Minimal BrowserSync setup with glup 4

[BrowserSync](https://www.browsersync.io/) is a great tool to streamline
the development process with the ability to reflect code changes instantaneously
in the browser through live-reloading. Setting up a live-reloading
BrowserSync server with glup 4 is very clean and easy.

## Step 1: Install the dependencies

```
npm install --save-dev browser-sync
```

## Step 2: Setup the project structure

```
src/
  scripts/
    |__ index.js
dist/
  scripts/
index.html
glupfile.babel.js
```

The goal here is to be able to:
- Build the source script file in `src/scripts/`, e.g. compiling with babel, minifying, etc.
- Put the compiled version in `dist/scripts` for use in `index.html`
- Watch for changes in the source file and rebuild the `dist` package
- With each rebuild of the `dist` package, reload the browser to immediately reflect the changes

## Step 3: Write the glupfile

The glupfile could be broken in 3 parts.

### 1. Write the task to prepare the dist package as usual

Refer to the main [README](https://github.com/glupjs/glup/blob/4.0/README.md#use-last-javascript-version-in-your-glupfile)
for more information.

```javascript
import babel from 'glup-babel';
import concat from 'glup-concat';
import del from 'del';
import glup from 'glup';
import uglify from 'glup-uglify';

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  }
};

const clean = () => del(['dist']);

function scripts() {
  return glup.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(glup.dest(paths.scripts.dest));
}
```

### 2. Setup the BrowserSync server

And write the tasks to serve and reload the server accordingly.

```javascript
import browserSync from 'browser-sync';
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}
```

### 3. Watch for source change, rebuild the scripts and reload the server

This is trivially accomplished with `glup.series`

```javascript
const watch = () => glup.watch(paths.scripts.src, glup.series(scripts, reload));
```

## Step 4: Bring it all together

The last step is to expose the default task

```javascript
const dev = glup.series(clean, scripts, serve, watch);
export default dev;
```

And profit

```bash
$ glup
```

Now if you go to [http://localhost:3000](http://localhost:3000), which is the default address of the
BrowserSync server, you will see that the end result in the browser is updated everytime you change
the content of the source file. Here is the whole glupfile:

```javascript
import babel from 'glup-babel';
import concat from 'glup-concat';
import del from 'del';
import glup from 'glup';
import uglify from 'glup-uglify';
import browserSync from 'browser-sync';

const server = browserSync.create();

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  }
};

const clean = () => del(['dist']);

function scripts() {
  return glup.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(glup.dest(paths.scripts.dest));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

const watch = () => glup.watch(paths.scripts.src, glup.series(scripts, reload));

const dev = glup.series(clean, scripts, serve, watch);
export default dev;
```
