"use strict";

var imp = lib("cylon-imp");

var Adaptor = lib("adaptor");

describe("Cylon.Imp", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(imp.adaptors).to.be.eql(["imp"]);
    });
  });

  describe("#dependencies", function() {
    it("is an array of supplied dependencies", function() {
      expect(imp.dependencies).to.be.eql(["cylon-gpio", "cylon-i2c"]);
    });
  });

  describe("#drivers", function() {
    it("is an array of supplied drivers", function() {
      expect(imp.drivers).to.be.eql([]);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      var adaptor = imp.adaptor({ adaptor: "imp", agentUrl: "" });
      expect(adaptor).to.be.an.instanceOf(Adaptor);
    });
  });
});
