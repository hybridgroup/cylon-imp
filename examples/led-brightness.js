var cylon = require('cylon');

cylon.robot({
  connections: {
    imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
  },

  device: { name: 'led', driver: 'led', pin: 1 },

  work: function(my){
    var brightness = 0;
    var fade = 20;

    every((1).seconds(), function(){
      brightness += fade;
      brightness = (brightness > 255) ? 255 : brightness;
      brightness = (brightness < 0) ? 0 : brightness;

      my.led.brightness(brightness);

      fade = ((brightness === 0) || (brightness === 255)) ? -fade : fade;
    });
  }
}).start();
