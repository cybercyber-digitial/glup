<!-- front-matter
id: javascript-and-glupfiles
title: JavaScript and glupfiles
hide_title: true
sidebar_label: JavaScript and glupfiles
-->

# JavaScript and glupfiles

glup allows you to use existing JavaScript knowledge to write glupfiles or to use your experience with glupfiles to write plain JavaScript. Although a few utilities are provided to simplify working with the filesystem and command line, everything else you write is pure JavaScript.

## glupfile explained

A glupfile is a file in your project directory titled `glupfile.js` (or capitalized as `glupfile.js`, like Makefile), that automatically loads when you run the `glup` command. Within this file, you'll often see glup APIs, like `src()`, `dest()`, `series()`, or `parallel()` but any vanilla JavaScript or Node modules can be used. Any exported functions will be registered into glup's task system.

## Transpilation

You can write a glupfile using a language that requires transpilation, like TypeScript or Babel, by changing the extension on your `glupfile.js` to indicate the language and install the matching transpiler module.

* For TypeScript, rename to `glupfile.ts` and install the [ts-node][ts-node-module] module.
* For Babel, rename to `glupfile.babel.js` and install the [@babel/register][babel-register-module] module.

__Most new versions of node support most features that TypeScript or Babel provide, except the `import`/`export` syntax. When only that syntax is desired, rename to `glupfile.esm.js` and install the [esm][esm-module] module.__

For a more advanced dive into this topic and the full list of supported extensions, see our [glupfile transpilation][glupfile-transpilation-advanced] documentation.

##  Splitting a glupfile

Many users start by adding all logic to a glupfile. If it ever grows too big, it can be refactored into separate files.

Each task can be split into its own file, then imported into your glupfile for composition. Not only does this keep things organized, but it allows you to test each task independently or vary composition based on conditions.

Node's module resolution allows you to replace your `glupfile.js` file with a directory named `glupfile.js` that contains an `index.js` file which is treated as a `glupfile.js`. This directory could then contain your individual modules for tasks.  If you are using a transpiler, name the folder and file accordingly.

[glupfile-transpilation-advanced]: ../documentation-missing.md
[ts-node-module]: https://www.npmjs.com/package/ts-node
[babel-register-module]: https://www.npmjs.com/package/@babel/register
[esm-module]: https://www.npmjs.com/package/esm
