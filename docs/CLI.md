## glup CLI docs

### Flags

glup has very few flags to know about. All other flags are for tasks to use if needed.

- `-v` or `--version` will display the global and local glup versions
- `--require <module path>` will require a module before running the glupfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
- `--glupfile <glupfile path>` will manually set path of glupfile. Useful if you have multiple glupfiles. This will set the CWD to the glupfile directory as well
- `--cwd <dir path>` will manually set the CWD. The search for the glupfile, as well as the relativity of all requires will be from here
- `-T` or `--tasks` will display the task dependency tree for the loaded glupfile. It will include the task names and their [description](./API.md#fndescription).
- `--tasks-simple` will display a plaintext list of tasks for the loaded glupfile
- `--verify` will verify plugins referenced in project's package.json against the plugins blacklist
- `--color` will force glup and glup plugins to display colors even when no color support is detected
- `--no-color` will force glup and glup plugins to not display colors even when color support is detected
- `--silent` will disable all glup logging

The CLI adds process.env.INIT_CWD which is the original cwd it was launched from.

#### Task specific flags

Refer to this [StackOverflow](https://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-glup-to-have-it-run-tasks-in-different-ways) link for how to add task specific flags

### Tasks

Tasks can be executed by running `glup <task> <task>...`.

If more than one task is listed, glup will execute all of them
concurrently, that is, as if they had all been listed as dependencies of
a single task.

glup does not serialize tasks listed on the command line. From using
other comparable tools users may expect to execute something like
`glup clean build`, with tasks named `clean` and `build`. This will not
produce the intended result, as the two tasks will be executed
concurrently.

Just running `glup` will execute the task `default`. If there is no
`default` task, glup will error.

### Compilers

You can find a list of supported languages at [interpret](https://github.com/tkellen/node-interpret#jsvariants). If you would like to add support for a new language send pull request/open issues there.

### Examples

#### Example glupfile

```js
glup.task('one', function(done) {
  // do stuff
  done();
});

glup.task('two', function(done) {
  // do stuff
  done();
});

glup.task('three', three);

function three(done) {
  done();
}
three.description = "This is the description of task three";

glup.task('four', glup.series('one', 'two'));

glup.task('five',
  glup.series('four',
    glup.parallel('three', function(done) {
      // do more stuff
      done();
    })
  )
);
```

### `-T` or `--tasks`

Command: `glup -T` or `glup --tasks`

Output:
```shell
[20:58:55] Tasks for ~\exampleProject\glupfile.js
[20:58:55] ├── one
[20:58:55] ├── two
[20:58:55] ├── three                                         This is the description of task three
[20:58:55] ├─┬ four
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├── one
[20:58:55] │   └── two
[20:58:55] ├─┬ five
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├─┬ four
[20:58:55] │   │ └─┬ <series>
[20:58:55] │   │   ├── one
[20:58:55] │   │   └── two
[20:58:55] │   └─┬ <parallel>
[20:58:55] │     ├── three
[20:58:55] │     └── <anonymous>
```

### `--tasks-simple`

Command: `glup --tasks-simple`

Output:
```shell
one
two
three
four
five
```
