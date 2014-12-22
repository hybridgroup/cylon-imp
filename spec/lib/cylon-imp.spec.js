"use strict";

var module = source("cylon-imp");

var Adaptor = source('adaptor');

describe("Cylon.Imp", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(["imp"]);
    });
  });

  describe("#dependencies", function() {
    it('is an array of supplied dependencies', function() {
      expect(module.dependencies).to.be.eql(["cylon-gpio", "cylon-i2c"]);
    });
  });

  describe("#drivers", function() {
    it('is an array of supplied drivers', function() {
      expect(module.drivers).to.be.eql([]);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      var adaptor = module.adaptor({ adaptor: "imp", agentUrl: '' });
      expect(adaptor).to.be.an.instanceOf(Adaptor);
    });
  });
});
