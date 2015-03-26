# wd-deasync

A wrapper around [wd.js](https://github.com/admc/wd) to make all Webdriver and Element methods synchronous, using [deasync](https://github.com/abbr/deasync). Adapted loosely from [node-wd-sync](https://github.com/sebv/node-wd-sync).

This library is meant to offer a straightforward API to WebDriver that’s also easy to use interactively in the REPL and the debugger. If the runtime environment supports ES6 generators (i.e. Node ≥0.11), it might be preferable to use something like [co](https://github.com/tj/co) to enable `yield`-ing on wd’s Promise interface, though this still complicates interactive usage.
