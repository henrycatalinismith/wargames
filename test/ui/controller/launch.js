var requirejs = require('requirejs'),
    should = require('should'),
    Barrage = requirejs('gtw/collection/barrage'),
    Missile = requirejs('gtw/model/missile'),
    LaunchControl = requirejs('gtw/ui/controller/launch');

describe('ui/controller/launch', function(){

  var launchControl, missile, barrage;

  before(function () {
    launchControl = new LaunchControl;
  });

  it('launches missiles as soon as they are added to the barrage', function() {
  });

});

