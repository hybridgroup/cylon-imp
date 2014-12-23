var cylon = require('cylon');

cylon.robot({
    connections: {
      imp: { adaptor: 'imp', agentUrl: 'https://agent.electricimp.com/79QYWvoV21bu', module: 'cylon-imp' }
    },

    devices: {
      bmp180: { driver:'bmp180' }
    },

    work: function(my) {
        my.bmp180.getTemperature(function(err, val) {
            if(err) {
              console.log(err);
            } else {
                console.log("getTemperature call:");
                console.log("\tTemp: " + val.temp + " C");
            }
        });

        after((1).seconds(), function() {
            console.log('reading pressure --->');
            my.bmp180.getPressure(1, function(err, val) {
                if(err) {
                  console.log(err);
                } else {
                    console.log("getPressure call:");
                    console.log("\tTemperature: " + val.temp + " C");
                    console.log("\tPressure: " + val.press + " Pa");
                }
            });
        });

        after((2).seconds(), function() {
            my.bmp180.getAltitude(1, null, function(err, val) {
                if(err) {
                  console.log(err);
                } else {
                    console.log("getAltitude call:");
                    console.log("\tTemperature: " + val.temp + " C");
                    console.log("\tPressure: " + val.press + " Pa");
                    console.log("\tAltitude: " + val.alt + " m");
                }
            });
        });

        every(2000, function() {
          my.bmp180.getAltitude(1, null, function(err, val) {
              if(err) {
                console.log(err);
              } else {
                  console.log("getAltitude call:");
                  console.log("\tTemperature: " + val.temp + " C");
                  console.log("\tPressure: " + val.press + " Pa");
                  console.log("\tAltitude: " + val.alt + " m");
              }
          });
        });

    }
}).start();
