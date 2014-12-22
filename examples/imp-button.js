var Cylon = require('cylon');

Cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
  },

  devices: {
    led: { driver: 'led', pin: '1' },
    button: { driver: 'button', pin: '2' }
  },

  work: function(my) {
    my.button.on('release', function(err, data) {
      console.log('Button released:');
    });

    my.button.on('press', function(err, data) {
      console.log('Button pressed:');
    });

    my.button.on('push', function() {
      console.log('Button pushed:');
      my.led.toggle();
    });
  }
}).start();