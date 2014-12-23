var cylon = require('cylon');

cylon.robot({

  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
  },

  device: { name: 'blinkm', driver: 'blinkm' },

  work: function(my) {
    my.blinkm.stopScript();

    setTimeout(function() {
      my.blinkm.getFirmware(function(err, version) {
        cylon.Logger.info("Started BlinkM version " + version);
      });
    }, 2000);

    console.log('Go to RGB');
    my.blinkm.goToRGB(255,0,0);

    console.log('Get RGB ');
    my.blinkm.getRGBColor(function(err, data){
      console.log("Starting Color: ", data);
    });

    console.log('Go to Magenta ');
    my.blinkm.fadeToRandomRGB(0, 0, 255);

    every((2).seconds(), function() {
      my.blinkm.getRGBColor(function(err, data){
        console.log("Current Color: ", data);
      });
      my.blinkm.fadeToRandomRGB(128, 128, 128);
    });
  }
}).start();
