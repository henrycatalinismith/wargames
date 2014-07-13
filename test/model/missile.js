var requirejs = require('requirejs'),
    should = require('should'),
    Missile = requirejs('model/missile');

describe('model/missile', function(){

  var missile;

  before(function () {
    missile = new Missile;
  });

  describe('#fire', function() {
    it('fires the missile', function() {
      missile.fire();
      missile.get('status').should.equal('flight');
    });
  });

});

