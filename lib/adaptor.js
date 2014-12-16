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

  opts = opts || {};

  this.agentUrl = opts.agentUrl;
  this.readInterval = opts.readInterval || 1000;
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
  rest.get(this.agentUrl, {
    query: {
      mode: 'digitalWrite',
      pin: pin,
      value: value
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  });
};

Adaptor.prototype.digitalRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(result, response) {
    var data = null;

    requestInProgress = false;

    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        data = JSON.parse(result).data;
        callback(null, parseInt(data));
      }
    }
  }.bind(this);

  cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      rest.get(this.agentUrl, {
        query: {
          mode: 'digitalRead',
          pin: pin
        }
      })
      .on('complete', complete);
    }
  }.bind(this));
};

Adaptor.prototype.analogRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(result, response) {
    var data = null;

    requestInProgress = false;

    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        data = JSON.parse(result).data;
        callback(null, parseInt(data));
      }
    }
  }.bind(this);

  cylon.Utils.every(this.readInterval, function() {
    if (!requestInProgress) {
      requestInProgress = true;
      rest.get(this.agentUrl, {
        query: {
          mode: 'analogRead',
          pin: pin
        }
      })
      .on('complete', complete);
    }
  }.bind(this));
};

Adaptor.prototype.pwmWrite = function(pin, value, freq, callback) {

  var period = 0.002;

  if (!!freq) {
    period = (1 / freq);
  }

  rest.get(this.agentUrl, {
    query: {
      mode: 'pwmWrite',
      pin: pin,
      value: value,
      period: period
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  });
};

Adaptor.prototype.analogWrite = function(pin, value, callback) {
  rest.get(this.agentUrl, {
    query: {
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
        callback(null, result);
      }
    }
  });
};

Adaptor.prototype.i2cWrite = function(address, command, buffer, callback) {
  buffer.unshift(command);

  rest.get(this.agentUrl, {
    query: {
      mode: 'i2cWrite',
      address: address,
      buffer: buffer.join(',')
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  });
};

Adaptor.prototype.i2cRead = function(address, command, bytes, callback) {
  rest.get(this.agentUrl, {
    query: {
      mode: 'i2cRead',
      address: address,
      buffer: command,
      bytes: bytes
    }
  })
  .on('complete', function(result, response) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      var data = JSON.parse(result).data;
      if ('function' === typeof(callback)) {
        callback(null, data);
      }
    }
  });
};
