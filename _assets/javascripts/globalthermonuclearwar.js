//= require bower_components/jquery/dist/jquery
//= require bower_components/underscore/underscore
//= require bower_components/backbone/backbone
//= require src/index
//= require src/model/missile
//= require src/collection/missile
//= require src/view/map
//= require src/view/missile

$(document).ready(function() {

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var missiles = new GlobalThermonuclearWar.Collection.Missile;

  missiles.push({
    origin: [55.749792, 37.632495],
    target: [38.8935965, -77.014576]
  });

  missiles.push({
    origin: [30.8935965, -87.014576],
    target: [5.749792, 7.632495]
  });

  var missileViews = [
    new GlobalThermonuclearWar.View.Missile({
      map: map,
      model: missiles.at(0)
    }),
    new GlobalThermonuclearWar.View.Missile({
      map: map,
      model: missiles.at(1)
    })
  ];

  function tick(length) {
    missiles.map(function(missile) {
      missile.tick();
    });
    setTimeout(tick, length);
  }

  tick(10);

  function move() {
    var remaining = google.maps.geometry.spherical.computeDistanceBetween(location, target);
    if (remaining > 10000) {
      setTimeout(move, tickLength);
    } else {
      var explosion = new google.maps.Circle({
        center: target,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map.map,
        radius: 100000,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });
    }
  }
});
