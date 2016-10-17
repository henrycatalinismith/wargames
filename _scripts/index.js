import $ from 'jquery';
import Map from './view/map';
import Overlay from './view/overlay';
import Explosions from './collection/explosion';
import Missiles from './collection/missile';
import Players from './collection/player';
import Player from './model/player';
import Bar from './view/bar';
import Multiplayer from './controller/multiplayer';
import GeoLocation from './controller/geolocation';
import Targetting from './controller/targetting';
import Flight from './controller/flight';
import Detonation from './controller/detonation';

$(document).ready(function() {
  console.log(Map, Overlay);
  const overlay = new Overlay({ el: $('#overlay') });
  const map = new Map({ el: $('#map') });

  const players = new Players;
  const missiles = new Missiles;
  const explosions = new Explosions;

  const player = new Player;
  players.push(player);

  const bar = new Bar({
    el: $('#icons'),
    players: players
  });

  const multiplayerController = new Multiplayer({
    url: window.location.href,
    info: bar,
    map: map,
    missiles: missiles,
    player: player,
    players: players
  });

  const geolocationController = new GeoLocation({
    map: map,
    overlay: overlay,
    player: player
  });
  geolocationController.locateUser();

  const targettingController = new Targetting({
    map: map,
    missiles: missiles,
    player: player
  });

  const flightController = new Flight({
    map: map,
    missiles: missiles
  });

  const detonationController = new Detonation({
    map: map,
    explosions: explosions,
    missiles: missiles
  });

});

/*



});

*/
