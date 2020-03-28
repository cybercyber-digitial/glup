# Automate release workflow

If your project follows a semantic versioning, it may be a good idea to automatize the steps needed to do a release.
Below you have a simple recipe that bumps the project version, commits the changes to git and creates a new tag.

``` javascript

var glup = require('glup');
var conventionalChangelog = require('glup-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('glup-bump');
var log = require('gluplog');
var git = require('glup-git');
var fs = require('fs');

glup.task('changelog', function () {
  return glup.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular' // Or to any other commit message convention you use.
    }))
    .pipe(glup.dest('./'));
});

glup.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: 'abcdefghijklmnopqrstuvwxyz1234567890' // change this to your own GitHub token or use an environment variable
  }, {
    preset: 'angular' // Or to any other commit message convention you use.
  }, done);
});

glup.task('bump-version', function () {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  return glup.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', log.error))
    .pipe(glup.dest('./'));
});

glup.task('commit-changes', function () {
  return glup.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

glup.task('push-changes', function (done) {
  git.push('origin', 'master', done);
});

glup.task('create-new-tag', function (done) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'master', {args: '--tags'}, done);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

glup.task('release', glup.series(
  'bump-version',
  'changelog',
  'commit-changes',
  'push-changes',
  'create-new-tag',
  'github-release'
));

```
