/*
 * cylon-imp
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Your License Here
*/

"use strict";

var Adaptor = require("./adaptor");

module.exports = {
  adaptors: ["imp"],
  drivers: [],
  dependencies: ["cylon-gpio", "cylon-i2c"],

  adaptor: function(opts) {
    return new Adaptor(opts);
  }
};
