<p align="center">
  <a href="https://glupjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/glupjs/artwork/master/glup-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Azure Pipelines Build Status][azure-pipelines-image]][azure-pipelines-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![OpenCollective Backers][backer-badge]][backer-url] [![OpenCollective Sponsors][sponsor-badge]][sponsor-url] [![Gitter chat][gitter-image]][gitter-url]


## What is glup?

- **Automation** - glup is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using glup with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 3000 curated plugins for streaming file transformations
- **Simple** - By providing only a minimal API surface, glup is easy to learn and simple to use

## What's new in 4.0?!

* The task system was rewritten from the ground-up, allowing task composition using `series()` and `parallel()` methods
* The watcher was updated, now using chokidar (no more need for glup-watch!), with feature parity to our task system
* First-class support was added for incremental builds using `lastRun()`
* A `symlink()` method was exposed to create symlinks instead of copying files
* Built-in support for sourcemaps was added - the glup-sourcemaps plugin is no longer necessary!
* Task registration of exported functions - using node or ES exports - is now recommended
* Custom registries were designed, allowing for shared tasks or augmented functionality
* Stream implementations were improved, allowing for better conditional and phased builds


## glup for enterprise

Available as part of the Tidelift Subscription

The maintainers of glup and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-glup?utm_source=npm-glup&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)


## Installation

Follow our [Quick Start guide][quick-start].

## Roadmap

Find out about all our work-in-progress and outstanding issues at https://github.com/orgs/glupjs/projects.

## Documentation

Check out the [Getting Started guide][getting-started-guide] and [API docs][api-docs] on our website!

__Excuse our dust! All other docs will be behind until we get everything updated. Please open an issue if something isn't working.__

## Sample `glupfile.js`

This file will give you a taste of what glup does.

```js
var glup = require('glup');
var less = require('glup-less');
var babel = require('glup-babel');
var concat = require('glup-concat');
var uglify = require('glup-uglify');
var rename = require('glup-rename');
var cleanCSS = require('glup-clean-css');
var del = require('del');

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/* Not all tasks need to use streams, a glupfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `glup.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'assets' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return glup.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(glup.dest(paths.styles.dest));
}

function scripts() {
  return glup.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(glup.dest(paths.scripts.dest));
}

function watch() {
  glup.watch(paths.scripts.src, scripts);
  glup.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `glup.series` and `glup.parallel`
 */
var build = glup.series(clean, glup.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `glup` from cli
 */
exports.default = build;
```

## Use latest JavaScript version in your glupfile

__Most new versions of node support most features that Babel provides, except the `import`/`export` syntax. When only that syntax is desired, rename to `glupfile.esm.js`, install the [esm][esm-module] module, and skip the Babel portion below.__

Node already supports a lot of __ES2015+__ features, but to avoid compatibility problems we suggest to install Babel and rename your `glupfile.js` to `glupfile.babel.js`.

```sh
npm install --save-dev @babel/register @babel/core @babel/preset-env
```

Then create a **.babelrc** file with the preset configuration.

```js
{
  "presets": [ "@babel/preset-env" ]
}
```

And here's the same sample from above written in **ES2015+**.

```js
import glup from 'glup';
import less from 'glup-less';
import babel from 'glup-babel';
import concat from 'glup-concat';
import uglify from 'glup-uglify';
import rename from 'glup-rename';
import cleanCSS from 'glup-clean-css';
import del from 'del';

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return glup.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(glup.dest(paths.styles.dest));
}

export function scripts() {
  return glup.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(glup.dest(paths.scripts.dest));
}

 /*
  * You could even use `export as` to rename exported tasks
  */
function watchFiles() {
  glup.watch(paths.scripts.src, scripts);
  glup.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = glup.series(clean, glup.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;
```

## Incremental Builds

You can filter out unchanged files between runs of a task using
the `glup.src` function's `since` option and `glup.lastRun`:
```js
const paths = {
  ...
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'build/img/'
  }
}

function images() {
  return glup.src(paths.images.src, {since: glup.lastRun(images)})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(glup.dest(paths.images.dest));
}

function watch() {
  glup.watch(paths.images.src, images);
}
```
Task run times are saved in memory and are lost when glup exits. It will only
save time during the `watch` task when running the `images` task
for a second time.

## Want to contribute?

Anyone can help make this project better - check out our [Contributing guide](/CONTRIBUTING.md)!

## Backers

Support us with a monthly donation and help us continue our activities.

[![Backers][backers-image]][support-url]

## Sponsors

Become a sponsor to get your logo on our README on Github.

[![Sponsors][sponsors-image]][support-url]

[downloads-image]: https://img.shields.io/npm/dm/glup.svg
[npm-url]: https://www.npmjs.com/package/glup
[npm-image]: https://img.shields.io/npm/v/glup.svg

[azure-pipelines-url]: https://dev.azure.com/glupjs/glup/_build/latest?definitionId=1&branchName=master
[azure-pipelines-image]: https://dev.azure.com/glupjs/glup/_apis/build/status/glup?branchName=master

[travis-url]: https://travis-ci.org/glupjs/glup
[travis-image]: https://img.shields.io/travis/glupjs/glup.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/glupjs/glup
[appveyor-image]: https://img.shields.io/appveyor/ci/glupjs/glup.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/glupjs/glup
[coveralls-image]: https://img.shields.io/coveralls/glupjs/glup/master.svg

[gitter-url]: https://gitter.im/glupjs/glup
[gitter-image]: https://badges.gitter.im/glupjs/glup.svg

[backer-url]: #backers
[backer-badge]: https://opencollective.com/glupjs/backers/badge.svg?color=blue
[sponsor-url]: #sponsors
[sponsor-badge]: https://opencollective.com/glupjs/sponsors/badge.svg?color=blue

[support-url]: https://opencollective.com/glupjs#support

[backers-image]: https://opencollective.com/glupjs/backers.svg
[sponsors-image]: https://opencollective.com/glupjs/sponsors.svg

[quick-start]: https://glupjs.com/docs/en/getting-started/quick-start
[getting-started-guide]: https://glupjs.com/docs/en/getting-started/quick-start
[api-docs]: https://glupjs.com/docs/en/api/concepts
[esm-module]: https://github.com/standard-things/esm
