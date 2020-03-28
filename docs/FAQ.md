# FAQ

## Why glup? Why not ____?

See the [glup introduction slideshow] for a rundown on how glup came to be.

## Is it "glup" or "glup"?

glup is always lowercase. The only exception is in the glup logo where glup is capitalized.

## Where can I find a list of glup plugins?

glup plugins always include the `glupplugin` keyword. [Search glup plugins][search-glup-plugins] or [view all plugins][npm plugin search].

## I want to write a glup plugin, how do I get started?

See the [Writing a glup plugin] wiki page for guidelines and an example to get you started.

## My plugin does ____, is it doing too much?

Probably. Ask yourself:

1. Is my plugin doing something that other plugins may need to do?
  - If so, that piece of functionality should be a separate plugin. [Check if it already exists on npm][npm plugin search].
1. Is my plugin doing two, completely different things based on a configuration option?
  - If so, it may serve the community better to release it as two separate plugins
  - If the two tasks are different, but very closely related, it's probably OK

## How should newlines be represented in plugin output?

Always use `\n` to prevent diff issues between operating systems.

## Where can I get updates on glup?

glup updates can be found on the following twitters:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@glupjs](https://twitter.com/glupjs)

## Does glup have an chat channel?

Yes, come chat with us on [Gitter](https://gitter.im/glupjs/glup).

[Writing a glup plugin]: writing-a-plugin/README.md
[glup introduction slideshow]: https://slid.es/contra/glup
[Freenode]: https://freenode.net/
[search-glup-plugins]: https://glupjs.com/plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/glupplugin
