# Exports as Tasks

Using the ES2015 module syntax you can use your exports as tasks.

```js
import glup from 'glup';
import babel from 'glup-babel';

// named task
export function build() {
  return glup.src('src/*.js')
    .pipe(babel())
    .pipe(glup.dest('lib'));
}

// default task
export default function dev() {
  glup.watch('src/*.js', ['build']);
}
```

This will **not** work with the glup-cli version bundled with glup 3.x. You must use the latest published version.
