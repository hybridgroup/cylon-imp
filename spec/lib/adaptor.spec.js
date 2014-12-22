'use strict';

var Adaptor = source('adaptor'),
    rest = require('restler');

describe("Cylon.Adaptors.Imp", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor({
      agentUrl: 'https://agent.electricimp.com/123456789',
      readInterval: 1000
    });
  });

  describe("#constructor", function() {
    var error = "No agentUrl provided for Imp adaptor. You need to provide one in the in the connection. Cannot proceed";

    it('sets @agentUrl to the provided value', function(){
      expect(adaptor.agentUrl).to.be.eql('https://agent.electricimp.com/123456789');
    });

    it('sets @readInterval to the provided value', function() {
      expect(adaptor.readInterval).to.be.eql(1000);
    });

    it('sets @readInterval to 2s by default', function() {
      adaptor = new Adaptor({ agentUrl: '' });
      expect(adaptor.readInterval).to.be.eql(2000);
    });

    context("if no agentUrl is specified", function() {
      it("throws an error", function() {
        var fn = function() { new Adaptor({ }); };
        expect(fn).to.throw(error);
      });
    });
  });

  describe('#connect', function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      adaptor.emit = spy();

      adaptor.connect(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledWith();
    });
  });

  describe('#disconnect', function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      adaptor.emit = spy();

      adaptor.disconnect(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledWith();
    });
  });

  describe("#commands", function() {
    it("is an array of Imp commands", function() {
      expect(adaptor.commands).to.be.an('array');

      adaptor.commands.map(function(cmd) {
        expect(cmd).to.be.a('string');
      });
    });
  });

  describe('digitalWrite', function() {
    var callback;

    beforeEach(function(){
      var res = { on: spy() };
      callback = spy();

      stub(rest, 'get').returns(res);
      //stub(rest, 'on');

      adaptor.digitalWrite(9, 1, callback);
    });

    afterEach(function() {
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      var params = {
        mode: '',
        pin: 0,
        value: 0
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      var params = {
        query: {
          mode: 'digitalWrite',
          pin: 9,
          value: 1
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });
  });
});
