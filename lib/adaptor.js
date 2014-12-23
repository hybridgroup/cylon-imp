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

/**
 * Imp Adaptor
 *
 * @constructor
 *
 * @param {Object} opts Options to setup the adaptor
 * @property {String} agentUrl The Agent url gotten from Electric Imp IDE
 * @property {Number} readInterval The delay between analog and digital reads
 */
var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.agentUrl = opts.agentUrl;
  this.readInterval = opts.readInterval || 2000;

  if (this.agentUrl == null) {
    throw new Error("No agentUrl provided for Imp adaptor. You need to provide one in the in the connection. Cannot proceed");
  }
};

cylon.Utils.subclass(Adaptor, cylon.Adaptor);

Adaptor.prototype.commands = [
  'digitalRead',
  'digitalwrite',
  'analogRead',
  'analogWrite',
  'pwmWrite',
];

/** Setups connections to the device and starts work */
Adaptor.prototype.connect = function(callback) {
  callback();
};

/** Terminates all connections, disconnects from the device and kills all pending work  */
Adaptor.prototype.disconnect = function(callback) {
  callback();
};

/**
 * Writes a digital value to the specified pin
 *
 * @param {Number} pin The pin number to write to
 * @param {Number} value Either 1 or 0 (High or Low)
 * @param {Function} callback Callback to be triggered when done
 * @publish
 */
Adaptor.prototype.digitalWrite = function(pin, value, callback) {
  rest.get(this.agentUrl, {
    query: {
      mode: 'digitalWrite',
      pin: pin,
      value: value
    }
  })
  .on('complete', function(result) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  }.bind(this));
};

/**
 * Does a digital read in the specified pin
 *
 * @param {Number} pin The pin number to read from
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
Adaptor.prototype.digitalRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(result) {
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

/**
 * Does an analog read in the specified pin
 *
 * @param {Number} pin The pin number to read from
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
Adaptor.prototype.analogRead = function(pin, callback) {
  var requestInProgress = false;

  var complete = function(result) {
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

/**
 * Writes a PWM value to the a pin
 *
 * @param {Number} pin The pin number to read from
 * @param {Number} value Value to be written from 0 - 1
 * @param {Number} freq Frequency for the PWM write
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
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
  .on('complete', function(result) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  });
};

/**
 * Writes a PWM value for servos to a pin (freq = 50)
 *
 * @param {Number} pin The pin number to read from
 * @param {Number} value Value to be written from 0 - 1
 * @param {Number} freq Frequency for the PWM write
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
Adaptor.prototype.servoWrite = function(pin, value, freq, callback) {
  this.pwmWrite(pin, value, 50, callback);
};

Adaptor.prototype.analogWrite = function(pin, value, callback) {
  rest.get(this.agentUrl, {
    query: {
      mode: 'analogWrite',
      pin: pin,
      value: value
    }
  })
  .on('complete', function(result) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  }.bind(this));
};

/**
 * Writes a command and buffer to a I2C device
 *
 * @param {Number} address Address for the I2C device in the bus line
 * @param {Byte} command Write command to be written to the I2C device 1byte = 8bit (0xFF)
 * @param {Array} buffer Array of bytes to be written to the bus [0xFF, 0x00, 0xFF ...]
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
Adaptor.prototype.i2cWrite = function(address, command, buffer, callback) {
  buffer.unshift(command);

  rest.get(this.agentUrl, {
    query: {
      mode: 'i2cWrite',
      address: address,
      buffer: buffer.join(',')
    }
  })
  .on('complete', function(result) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      if ('function' === typeof(callback)) {
        callback(null, result);
      }
    }
  }.bind(this));
};

/**
 * Reads from a I2C device
 *
 * @param {Number} address Address for the I2C device in the bus line
 * @param {Byte} command Read command to be written to the I2C device 1byte = 8bit (0xFF)
 * @param {Number} bytes Amount of bytes to be read from the I2C device
 * @param {Function} callback Callback to be triggered when done, gets passed (err, data)
 * @publish
 */
Adaptor.prototype.i2cRead = function(address, command, bytes, callback) {
  rest.get(this.agentUrl, {
    query: {
      mode: 'i2cRead',
      address: address,
      buffer: command,
      bytes: bytes
    }
  })
  .on('complete', function(result) {
    if (result instanceof Error) {
      this.emit('error', result);
    } else {
      var data = JSON.parse(result).data;
      if ('function' === typeof(callback)) {
        callback(null, data);
      }
    }
  }.bind(this));
};
