var cylon = require('cylon');

cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
  },

  devices: {
    led: { driver: 'led', pin: 1 }
  },

  work: function(my) {
    every((1).second(), function() {
      my.led.toggle();
    });
  }
}).start();
