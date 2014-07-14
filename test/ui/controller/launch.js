define([
  'mocha',
  'sinon',
  'gtw/ui/controller/launch',
  'gtw/model/missile',
  'gtw/collection/barrage'
], function(mocha, sinon, LaunchControl, Missile, Barrage) {

  describe('ui/controller/launch', function(){

    var launchControl, missile, barrage;

    before(function () {
      missile = new Missile;
      barrage = new Barrage;
      launchControl = new LaunchControl({
        barrage: barrage
      });
    });

    it('launches missiles as soon as they are added to the barrage', function() {
      var spy = sinon.spy();
      missile.on('change', spy);
      barrage.add(missile);
      spy.calledOnce.should.be.true;
    });

  });
});
