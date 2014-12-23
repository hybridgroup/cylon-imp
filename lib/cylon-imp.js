/*
 * cylon-imp
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Your License Here
*/

'use strict';

var Adaptor = require('./adaptor');

module.exports = {
  // Adaptors your module provides, e.g. ['spark']
  adaptors: ['imp'],

  // Drivers your module provides, e.g. ['led', 'button']
  drivers: [],

  // Modules intended to be used with yours, e.g. ['cylon-gpio']
  dependencies: ['cylon-gpio', 'cylon-i2c'],

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function() {
  }
};
