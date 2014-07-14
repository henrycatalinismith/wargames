define([
  'marionette',
  'jquery',
  'gtw/ui/view/map',
  'gtw/ui/controller/launch',
  'gtw/model/missile'
], function(Marionette, $, Map, LaunchControl, Missile) {

  var Application = new Marionette.Application;

  Application.addInitializer(function(options) {
    var map = new Map({
      el: $('#map')
    });

    var launchControl = new LaunchControl(map);
    launchControl.fireMissile([55.749792, 37.632495], [38.8935965, -77.014576]);

    var missile = new Missile;
    console.log(missile);
  });

  return Application;
});
