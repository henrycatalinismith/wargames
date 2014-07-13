var requirejs = require('requirejs'),
    should = require('should'),
    Missile = requirejs('model/missile');

describe('model/missile', function(){

  var missile;

  before(function () {
    missile = new Missile;
  });

  describe('#fire', function() {
    it('fires missiles that are ready', function() {
      missile.set({ status: 'ready' });
      missile.fire();
      missile.get('status').should.equal('flight');
    });

    it('fails when firing non-ready missiles', function() {
      missile.set({ status: 'detonated' });
      (function () {
        missile.fire();
      }).should.throw('Cannot fire missiles that are not ready');
    });
  });

  describe('#detonate', function() {
    it('detonates missiles in flight', function() {
      missile.set({ status: 'flight' });
      missile.detonate();
      missile.get('status').should.equal('detonated');
    });

    it('refuses to detonate missiles that are not in flight', function() {
      missile.set({ status: 'ready' });
      (function () {
        missile.detonate();
      }).should.throw('Cannot detonate missiles that are not in flight');
    });
  });

});

