//= require bower_components/jquery/dist/jquery
//= require bower_components/underscore/underscore
//= require bower_components/backbone/backbone
//= require bower_components/marionette/lib/backbone.marionette
//= require src/index
//= require src/model/explosion
//= require src/model/missile
//= require src/collection/explosion
//= require src/collection/missile
//= require src/controller/detonation
//= require src/controller/flight
//= require src/controller/multiplayer
//= require src/view/explosion
//= require src/view/map
//= require src/view/missile

$(document).ready(function() {

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var missiles = new GlobalThermonuclearWar.Collection.Missile;
  var explosions = new GlobalThermonuclearWar.Collection.Explosion;

  var flightController = new GlobalThermonuclearWar.Controller.Flight({
    missiles: missiles
  });

  var detonationController = new GlobalThermonuclearWar.Controller.Detonation({
    map: map,
    explosions: explosions,
    missiles: missiles
  });

  var multiplayerController = new GlobalThermonuclearWar.Controller.Multiplayer({
    url: window.location.href,
    missiles: missiles
  });

  missiles.on('add', function(missile) {
    var view = new GlobalThermonuclearWar.View.Missile({
      map: map,
      model: missile
    });
  });

  google.maps.event.addListener(map.map, 'click', function(event) {
    ga('send', 'event', 'missile', 'launch');
    var missile = new GlobalThermonuclearWar.Model.Missile({
      origin: [51.454513, -2.58791],
      target: [event.latLng.lat(), event.latLng.lng()]
    });
    missiles.push(missile);
    missile.launch();
  });

});
