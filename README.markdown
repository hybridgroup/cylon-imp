# Cylon.js For Imp

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js

This repository contains the Cylon adaptor for the Electric Imp (https://electricimp.com/) platform.

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-imp.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-imp) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-imp/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-imp) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-imp/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-imp)

## Getting Started

Install the module with: `npm install cylon-imp`

## Examples

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'imp', adaptor: 'imp' },
  device: {name: 'imp', driver: 'imp'},

  work: function(my) {
    // provide an example of your module here
  }
}).start();
```

## Connecting

Explain how to connect from the computer to the device here...

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

None yet...

## License

Copyright (c) 2014 The Hybrid Group. Licensed under the Apache 2.0 license.
