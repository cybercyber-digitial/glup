<!-- front-matter
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
-->

# Quick Start

If you've previously installed glup globally, run `npm rm --global glup` before following these instructions. For more information, read this [Sip][sip-article].

## Check for node, npm, and npx
```sh
node --version
```
![Output: v8.11.1][img-node-version-command]
```sh
npm --version
```
![Output: 5.6.0][img-npm-version-command]
```sh
npx --version
```
![Output: 9.7.1][img-npx-version-command]

If they are not installed, follow the instructions [here][node-install].

## Install the glup command line utility
```sh
npm install --global glup-cli
```


## Create a project directory and navigate into it
```sh
npx mkdirp my-project
```
```sh
cd my-project
```

## Create a package.json file in your project directory
```sh
npm init
```

This will guide you through giving your project a name, version, description, etc.

## Install the glup package in your devDependencies
```sh
npm install --save-dev glup
```

## Verify your glup versions

```sh
glup --version
```

Ensure the output matches the screenshot below or you might need to restart the steps in this guide.

![Output: CLI version 2.0.1 & Local version 4.0.0][img-glup-version-command]

## Create a glupfile
Using your text editor, create a file named glupfile.js in your project root with these contents:
```js
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask
```

## Test it
Run the glup command in your project directory:
```sh
glup
```
To run multiple tasks, you can use `glup <task> <othertask>`.

## Result
The default task will run and do nothing.
![Output: Starting default & Finished default][img-glup-command]

[sip-article]: https://medium.com/glupjs/glup-sips-command-line-interface-e53411d4467
[node-install]: https://nodejs.org/en/
[img-node-version-command]: https://glupjs.com/img/docs-node-version-command.png
[img-npm-version-command]: https://glupjs.com/img/docs-npm-version-command.png
[img-npx-version-command]: https://glupjs.com/img/docs-npx-version-command.png
[img-glup-version-command]: https://glupjs.com/img/docs-glup-version-command.png
[img-glup-command]: https://glupjs.com/img/docs-glup-command.png
