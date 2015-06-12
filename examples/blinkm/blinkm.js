"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    imp: {
      adaptor: "imp",
      agentUrl: "https://agent.electricimp.com/79QYWvoV21bu",
    }
  },

  device: { name: "blinkm", driver: "blinkm" },

  work: function(my) {
    my.blinkm.stopScript();

    setTimeout(function() {
      my.blinkm.getFirmware(function(err, version) {
        if (err) { console.log(err); }
        console.log("Started BlinkM version " + version);
      });
    }, 2000);

    console.log("Go to RGB");
    my.blinkm.goToRGB(255, 0, 0);

    console.log("Get RGB ");
    my.blinkm.getRGBColor(function(err, data) {
      if (err) { console.log(err); }
      console.log("Starting Color: ", data);
    });

    console.log("Go to Magenta ");
    my.blinkm.fadeToRandomRGB(0, 0, 255);

    every((2).seconds(), function() {
      my.blinkm.getRGBColor(function(err, data) {
        if (err) { console.log(err); }
        console.log("Current Color: ", data);
      });
      my.blinkm.fadeToRandomRGB(128, 128, 128);
    });
  }
}).start();
