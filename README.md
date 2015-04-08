# Cylon.js For Imp

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js

This repository contains the Cylon adaptor for the Electric Imp (https://electricimp.com/) platform.

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-imp.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-imp) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-imp/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-imp) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-imp/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-imp)

## How to Install

Install the module with:

    $ npm install cylon cylon-imp

You'll also need to setup your Imp, for this you can go here: [Electric Imp Getting Started](https://electricimp.com/docs/gettingstarted/)

Once you have completed the Getting Started process and have a connected Imp, you need to go to the [Electric Imp IDE](https://ide.electricimp.com/ide) page and create a new model that you can attach your Imp to. You can check how that process works in detail on the [Electric Imp IDE docs](https://electricimp.com/docs/gettingstarted/ide/)

## How to Use

### Blink LED: Digital GPIO

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/45QYZvoB41bu', module: 'cylon-imp' }
  },

  devices: {
    led: { driver: 'led', pin: 1 }
  },

  work: function(my) {
    every((1).second(), function() {
      my.led.toggle();
    });
  }
}).start()
```

## How to Connect

We need to setup the Agent code and Device code so we can control the Imp over the internet. First we need to setup the agent that
will serve as the endpoint URL for our Imp.

### Setting up the Agent

<img src="http://cylonjs.com/images/screenshots/imp-agent-screenshot.png" style="margin-top: 15px; width: 100%">

Inside the Electric Imp IDE, on the left side (for the default layout), you'll find the Agent section, you need to paste the following code:

```c
// Log the URLs we need
server.log("Agent URL: " + http.agenturl());

saved_response <- null;

function requestHandler(request, response) {
  local jsonRes = {};
  try {
    // check if the user sent led as a query parameter

    if ("mode" in request.query) {
      local value = ("value" in request.query) ? request.query.value : 0;
      local pin = ("pin" in request.query) ? request.query.pin : 0;
      local address = ("address" in request.query) ? request.query.address : null;
      local buffer = ("buffer" in request.query) ? request.query.buffer : null;
      local bytes = ("bytes" in request.query) ? request.query.bytes : null;

      device.send(request.query.mode, {
        "mode": request.query.mode,
        "pin": pin,
        "value": value,
        "address": address,
        "buffer": buffer,
        "bytes": bytes
      })
    }
    // send a response back saying everything was OK.
    //response.send(200, jsonRes);
    saved_response = response;
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}

function responseHandler(data) {
  saved_response.send(200, http.jsonencode(data));
}

// register the HTTP handler
http.onrequest(requestHandler);

// register device response listener for digital and analog reads
device.on("response", responseHandler);
```

This will allow use to send commands to the Imp, specify modes, setup pins and consotrl I2C devices. You can also find
this code in the utils section of this repo.

### Setting up the Device firmware

<img src="http://cylonjs.com/images/screenshots/imp-device-screenshot.png" style="margin-top: 15px; width: 100%">

Same as with the Agent code we do this inside the Electric Imp IDE, but now on the right side viewport, there you'll see the Device section, same as before paste the following code:

```c
// create a global variabled called led and assign pin9 to it
pins <- {
  "1": hardware.pin1,
  "2": hardware.pin2,
  "5": hardware.pin5,
  "7": hardware.pin7,
  "8": hardware.pin8,
  "9": hardware.pin9,
};

function digitalWrite(args) {
  pins[args.pin].configure(DIGITAL_OUT);
  pins[args.pin].write(args.value.tointeger());

  agent.send("response", { "data": null });
}

function digitalRead(args) {
  pins[args.pin].configure(DIGITAL_IN);
  local readVal = pins[args.pin].read();

  agent.send("response", { "data": readVal });
}

function analogWrite(args) {
  pins[args.pin].configure(ANALOG_OUT);
  pins[args.pin].write(args.value.tofloat());

  agent.send("response", { "data": null });
}

function analogRead(args) {
  pins[args.pin].configure(ANALOG_IN);
  local readVal = pins[args.pin].read();

  agent.send("response", { "data": readVal });
}

function pwmWrite(args) {
  local freq = 0.02;

  if ("freq" in args) {
    freq = args.freq;
  }

  pins[args.pin].configure(PWM_OUT, freq, 1);
  pins[args.pin].write(args.value.tofloat());

  agent.send("response", { "data": null });
}

function i2cWrite(args) {
  hardware.i2c89.configure(CLOCK_SPEED_400_KHZ);
  local i2c = hardware.i2c89;

  local buffer = split(args.buffer, ",");
  local binaryAddress = 0x00;
  local binaryBuffer = "";

  binaryAddress += args.address.tointeger() << 1;

  foreach(val in buffer){
    binaryBuffer += val.tointeger().tochar();
  }

  i2c.write(binaryAddress, binaryBuffer);

  agent.send("response", { "data": null });
}

function i2cRead(args) {
  hardware.i2c89.configure(CLOCK_SPEED_400_KHZ);
  local i2c = hardware.i2c89;

  local buffer = split(args.buffer, ",");
  local binaryAddress = 0x00;
  local binaryBuffer = "";
  local bytesLength = args.bytes.tointeger();

  binaryAddress += args.address.tointeger() << 1;

  foreach(val in buffer){
    binaryBuffer += val.tointeger().tochar();
  }

  //i2c.write(binaryAddress, binaryBuffer);
  local data = i2c.read(binaryAddress, binaryBuffer, bytesLength)
  local dataArray = [];

  foreach(val in data) {
    dataArray.push(val);
  }

  agent.send("response", { "data": dataArray });
}

agent.on("digitalWrite", digitalWrite);
agent.on("digitalRead", digitalRead);
agent.on("analogWrite", analogWrite);
agent.on("analogRead", analogRead);
agent.on("pwmWrite", pwmWrite);
agent.on("i2cWrite", i2cWrite);
agent.on("i2cRead", i2cRead);
```

This will execute code in your Imp device when you make calls to the Agent using the agent URL,
you can check how to do this in the following section.

Your Imp device is one click away of being ready to communicate and execute code, just click on the `Build and Run` button
on the top of the IDE and you should be ready to go.

### Talking to your imp through the Agent URL

In order to use Cylon to communicate with your Imp we'll need the agent URL. You can find this URL right above the Agent viewport of the IDE, alternatively you can look for it in the log after you click `Build and Run`.

Once you have this url, which should like something along the lines of `https://agent.electricimp.com/45QYZvoB41bu`, you can pass it along the adaptor parameters in your Cylon code.

This is how you setup the connection using the agent url in Cylon:

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/45QYZvoB41bu', module: 'cylon-imp' }
  },

// Rest of code ...
}).start()
```

## Documentation

We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

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

0.3.0   | Compatability with Cylon 1.0.0
0.2.0   | Compatability with Cylon 0.22.0
0.1.1   | Update package info
0.1.0   | Initial release for ongoing development

## License

Copyright (c) 2014 The Hybrid Group. Licensed under the Apache 2.0 license.
