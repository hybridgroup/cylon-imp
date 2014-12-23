'use strict';

var Cylon = require('cylon');

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
    var callback, res;

    beforeEach(function(){
      res = { on: stub() };
      callback = spy();

      stub(rest, 'get').returns(res);
      res.on.yields('success', 'response');

      adaptor.digitalWrite(1, 1, callback);
    });

    afterEach(function() {
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      var params = {
        query: {
          mode: 'digitalWrite',
          pin: 1,
          value: 1
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    it("calls the callback on success", function() {
      expect(callback).to.be.calledWith(null, 'success');
    });

    context('if the call returns an error', function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, 'error');
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });

  describe('digitalRead', function() {
    var callback, res;

    beforeEach(function(){
      res = { on: stub() };
      callback = spy();

      stub(rest, 'get').returns(res);
      res.on.yields('{ "data": 1 }', null);

      stub(Cylon.Utils, 'every').yields();
      adaptor.digitalRead(1, callback);
    });

    afterEach(function() {
      Cylon.Utils.every.restore();
      rest.get.restore();
    });

    it("reads on @readInterval", function() {
      expect(Cylon.Utils.every).to.be.calledWith(adaptor.readInterval);
    });

    it("should make a GET HTTP request to agentUrl with correct params", function() {
      var params = {
        query: {
          mode: 'digitalRead',
          pin: 1
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    it("doesn't make new requests if the current one hasn't finished", function() {
      expect(rest.get).to.be.calledOnce;
    });

    context("if #digitalRead returns a value", function() {
      beforeEach(function() {
        adaptor.emit = spy();
      });

      it("triggers the callback with the error", function() {
        res.on.callsArgWith(1, '{ "data": 1 }', null);
        expect(callback).to.be.calledWith(null, 1);
      });
    });

    context("if #digitalread request returns an error", function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, null);
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });

  describe('analogRead', function() {
    var callback, res;

    beforeEach(function(){
      res = { on: stub() };
      callback = spy();

      stub(rest, 'get').returns(res);
      res.on.yields('{ "data": 32000 }', null);

      stub(Cylon.Utils, 'every').yields();

      adaptor.analogRead(1, callback);
    });

    afterEach(function() {
      Cylon.Utils.every.restore();
      rest.get.restore();
    });

    it("reads on @readInterval", function() {
      expect(Cylon.Utils.every).to.be.calledWith(adaptor.readInterval);
    });

    it("should make a GET HTTP request to agentUrl with correct params", function() {
      var params = {
        query: {
          mode: 'analogRead',
          pin: 1
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    it("doesn't make new requests if the current one hasn't finished", function() {
      expect(rest.get).to.be.calledOnce;
    });

    context("if #digitalRead returns a value", function() {
      beforeEach(function() {
        adaptor.emit = spy();
      });

      it("triggers the callback with the error", function() {
        res.on.yield('{ "data": 1 }', null);
        expect(callback).to.be.calledWith(null, 1);
      });
    });

    context("if #digitalread request returns an error", function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, null);
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });

  describe('#pwmWrite', function() {
    var callback;

    beforeEach(function(){
      var res = { on: spy() };
      callback = spy();

      stub(rest, 'get').returns(res);

      adaptor.pwmWrite(1, 0.5, null, callback);
    });

    afterEach(function() {
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      var params = {
        query: {
          mode: 'pwmWrite',
          pin: 1,
          period: 0.002,
          value: 0.5
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    it("sets a default period", function() {
      var params = {
        query: {
          mode: 'pwmWrite',
          pin: 1,
          period: 0.002,
          value: 0.5
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });
  });

  describe('#servoWrite', function() {
    var callback;

    beforeEach(function(){
      var res = { on: spy() };
      callback = spy();

      stub(rest, 'get').returns(res);
      spy(adaptor, 'pwmWrite');

      adaptor.servoWrite(1, 0.5, null, callback);
    });

    afterEach(function() {
      rest.get.restore();
      adaptor.pwmWrite.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      expect(adaptor.pwmWrite).to.be.calledWith(1, 0.5, 50, callback);
      expect(rest.get).to.be.calledOnce;
    });
  });

  describe('#analogWrite', function() {
    var callback, res;

    beforeEach(function(){
      res = { on: spy() };
      callback = spy();

      stub(rest, 'get').returns(res);

      adaptor.analogWrite(1, 0.5, callback);
    });

    afterEach(function() {
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      var params = {
        query: {
          mode: 'analogWrite',
          pin: 1,
          value: 0.5
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    context('if the call returns an error', function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, 'error');
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });

  describe('#i2cWrite', function() {
    var callback, res;

    beforeEach(function(){
      res = { on: spy() };
      callback = spy();

      stub(rest, 'get').returns(res);

      adaptor.i2cWrite(0x09, 0xfe, [0xaa, 0xbb, 0xcc], callback);
    });

    afterEach(function() {
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl address", function() {
      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789');
    });

    it("should pass the correct parameters", function() {
      var params = {
        query: {
          mode: 'i2cWrite',
          address: 0x09,
          buffer: [0xfe, 0xaa, 0xbb, 0xcc].join(',')
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    context('if the call returns an error', function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, 'error');
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });

  describe('i2cRead', function() {
    var callback, res;

    beforeEach(function(){
      res = { on: stub() };
      callback = spy();

      stub(rest, 'get').returns(res);
      res.on.yields('{ "data": 1023 }', null);

      stub(Cylon.Utils, 'every').yields();

      adaptor.i2cRead(0x09, 0xf1, 3, callback);
    });

    afterEach(function() {
      Cylon.Utils.every.restore();
      rest.get.restore();
    });

    it("should make a GET HTTP request to agentUrl with correct params", function() {
      var params = {
        query: {
          mode: 'i2cRead',
          address: 0x09,
          buffer:0xf1,
          bytes: 3
        }
      };

      expect(rest.get).to.be.calledWith('https://agent.electricimp.com/123456789', params);
    });

    context("if #digitalRead returns a value", function() {
      beforeEach(function() {
        adaptor.emit = spy();
      });

      it("triggers the callback with the error", function() {
        res.on.yield('{ "data": 1 }', null);
        expect(callback).to.be.calledWith(null, 1);
      });
    });

    context("if #digitalread request returns an error", function() {
      var error = new Error('error');

      beforeEach(function() {
        adaptor.emit = spy();
        res.on.yield(error, null);
      });

      it("triggers an error event", function() {
        expect(adaptor.emit).to.be.calledWith('error', error);
      });
    });
  });
   
});
