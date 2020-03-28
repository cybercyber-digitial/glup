# Split tasks across multiple files

If your `glupfile.js` is starting to grow too large, you can split the tasks
into separate files by using the [glup-hub](https://github.com/frankwallis/glup-hub/tree/4.0)
module as a [custom registry](https://github.com/phated/undertaker#registryregistryinstance).

Imagine the following file structure:

```
glupfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Install the `glup-hub` module:

```sh
npm install --save-dev glup glup-hub
```

Add the following lines to your `glupfile.js` file:

```js
'use strict';

var glup = require('glup');
var HubRegistry = require('glup-hub');

/* load some files into the registry */
var hub = new HubRegistry(['tasks/*.js']);

/* tell glup to use the tasks just loaded */
glup.registry(hub);
```

This recipe can also be found at https://github.com/frankwallis/glup-hub/tree/4.0/examples/recipe
