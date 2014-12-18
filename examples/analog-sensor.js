var Cylon = require('cylon');

Cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
  },

  devices: {
    sensor: { driver: 'analogSensor', pin: 2, lowerLimit: 10000, upperLimit: 50000 }
  },

  work: function(my) {

    var analogValue = 0;

    every((1).second(), function() {
      analogValue = my.sensor.analogRead();
      console.log('Analog value => ', analogValue);
    });

    my.sensor.on('lowerLimit', function(val) {
      console.log("Lower limit reached!");
      console.log('Analog value => ', val);
    });

    my.sensor.on('upperLimit', function(val) {
      console.log("Upper limit reached!");
      console.log('Analog value => ', val);
    });
  }
}).start();
