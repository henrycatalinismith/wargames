$(document).ready(function() {

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var missiles = new GlobalThermonuclearWar.Collection.Missile;
  var explosions = new GlobalThermonuclearWar.Collection.Explosion;

  var targettingController = new GlobalThermonuclearWar.Controller.Targetting({
    map: map,
    missiles: missiles
  });

  var flightController = new GlobalThermonuclearWar.Controller.Flight({
    map: map,
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

});
