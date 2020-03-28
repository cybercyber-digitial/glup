# Specifying a new cwd (current working directory)

This is helpful for projects using a nested directory structure, such as:

```
/project
  /layer1
  /layer2
```

You can use the glup CLI option `--cwd`.

From the `project/` directory:

```sh
glup --cwd layer1
```

If you only need to specify a cwd for a certain glob, you can use the `cwd` option on a [glob-stream](https://github.com/glupjs/glob-stream):

```js
glup.src('./some/dir/**/*.js', { cwd: 'public' });
```
