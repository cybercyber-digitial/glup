# Run Grunt Tasks from glup

It is possible to run Grunt tasks / Grunt plugins from within glup. This can be useful during a gradual migration from Grunt to glup or if there's a specific plugin that you need. With the described approach no Grunt CLI and no Gruntfile is required.

**This approach requires Grunt >=1.0.0**

very simple example `glupfile.js`:

```js
// npm install glup grunt grunt-contrib-copy --save-dev

var glup = require('glup');
var grunt = require('grunt');

grunt.initConfig({
    copy: {
        main: {
            src: 'src/*',
            dest: 'dest/'
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-copy');

glup.task('copy', function (done) {
    grunt.tasks(
        ['copy:main'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function () {done();}
    );
});

```

Now start the task with:
`glup copy`

With the aforementioned approach the grunt tasks get registered within glup's task system. **Keep in mind grunt tasks are usually blocking (unlike glup), therefore no other task (not even a glup task) can run until a grunt task is completed.**


### A few words on alternatives

There's a *glupfriendly* node module `glup-grunt` [available](https://www.npmjs.org/package/glup-grunt) which takes a different approach. It spawns child processes and within them the grunt tasks are executed. The way it works implies some limitations though:

* It is at the moment not possible to pass options / cli args etc. to the grunt tasks via `glup-grunt`
* All grunt tasks have to be defined in a separate Gruntfile
* You need to have the Grunt CLI installed
* The output of some grunt tasks gets malformatted (.i.e. color coding).
