/*
 * cylon-imp adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var cylon = require('cylon');
var rest = require('restler');

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.agentUrl = opts.agentUrl;

  opts = opts || {};
};

cylon.Utils.subclass(Adaptor, cylon.Adaptor);

Adaptor.prototype.commands = [
  'digitalRead',
  'digitalwrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
];

Adaptor.prototype.connect = function(callback) {
  callback();
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};

Adaptor.prototype.digitalWrite = function(pin, value, callback) {
  //console.log("Digital Write pin:", pin);
  //console.log("Digital Write value:", value);
  rest.get(this.agentUrl, {
    query: {
      mode: 'digitalWrite',
      pin: pin,
      value: value
    }
  })
  .on('complete', function(result, response) {
    //console.log('result ---->', result);
    //console.log('response ---->', response);
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, response);
      }
    }
  });
};

Adaptor.prototype.digitalRead = function(pin, callback) {
  rest.get(this.agentUrl, {
    data: {
      mode: 'digitalRead',
      pin: pin
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, response);
      }
    }
  });
};

Adaptor.prototype.analogRead = function(pin, callback) {
  rest.get(this.agentUrl, {
    data: {
      mode: 'analogRead',
      pin: pin
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, response);
      }
    }
  });
};

Adaptor.prototype.pwmWrite = function(pin, value, freq) {
  rest.get(this.agentUrl, {
    query: {
      mode: 'pwmWrite',
      pin: pin,
      value: value,
      freq: freq
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, response);
      }
    }
  });
};

Adaptor.prototype.analogWrite = function(pin, value, callback) {
  rest.get(this.agentUrl, {
    data: {
      mode: 'analogWrite',
      pin: pin,
      value: value
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, response);
      }
    }
  });
};
