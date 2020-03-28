# Templating with Swig and YAML front-matter
Templating can be setup using `glup-swig` and `glup-front-matter`:

##### `page.html`

```html
---
title: Things to do
todos:
    - First todo
    - Another todo item
    - A third todo item
---
<html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        <h1>{{ title }}</h1>
        <ul>{% for todo in todos %}
          <li>{{ todo }}</li>
        {% endfor %}</ul>
    </body>
</html>
```

##### `glupfile.js`

```js
var glup = require('glup');
var swig = require('glup-swig');
var frontMatter = require('glup-front-matter');

glup.task('compile-page', function() {
  glup.src('page.html')
      .pipe(frontMatter({ property: 'data' }))
      .pipe(swig())
      .pipe(glup.dest('build'));
});

glup.task('default', ['compile-page']);
```
