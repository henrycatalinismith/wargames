$(document).ready(function() {

  var overlay = new GlobalThermonuclearWar.View.Overlay({
    el: $('#overlay')
  });

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var players = new GlobalThermonuclearWar.Collection.Player;
  var missiles = new GlobalThermonuclearWar.Collection.Missile;
  var explosions = new GlobalThermonuclearWar.Collection.Explosion;

  var player = new GlobalThermonuclearWar.Model.Player;
  players.push(player);

  var info = new GlobalThermonuclearWar.View.Info({
    el: $('#icons'),
    players: players
  });

  var multiplayerController = new GlobalThermonuclearWar.Controller.Multiplayer({
    url: window.location.href,
    info: info,
    map: map,
    missiles: missiles,
    player: player,
    players: players
  });

  var geolocationController = new GlobalThermonuclearWar.Controller.Geolocation({
    map: map,
    overlay: overlay,
    player: player
  });

  geolocationController.locateUser();

  var targettingController = new GlobalThermonuclearWar.Controller.Targetting({
    map: map,
    missiles: missiles,
    player: player
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

});
