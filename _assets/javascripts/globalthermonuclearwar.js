//= require bower_components/jquery/dist/jquery
//= require bower_components/underscore/underscore
//= require bower_components/backbone/backbone
//= require src/index
//= require src/model/explosion
//= require src/model/missile
//= require src/collection/explosion
//= require src/collection/missile
//= require src/view/explosion
//= require src/view/map
//= require src/view/missile

$(document).ready(function() {

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var missiles = new GlobalThermonuclearWar.Collection.Missile;
  var explosions = new GlobalThermonuclearWar.Collection.Explosion;

  missiles.on('add', function(missile) {
    var view = new GlobalThermonuclearWar.View.Missile({
      map: map,
      model: missile
    });
  });

  missiles.on('detonation', function(missile) {
    explosions.push({
      latitude: missile.get('target')[0],
      longitude: missile.get('target')[1]
    });
  });


  explosions.on('add', function(explosion) {
    var view = new GlobalThermonuclearWar.View.Explosion({
      map: map,
      model: explosion
    });
    view.render();
  });

  function tick(length) {
    missiles
      .filter(function(missile) { return missile.get('status') === 'flight'; })
      .map(function(missile) { missile.tick(); });
    setTimeout(tick, length);
  }

  tick(10);

  missiles.push({ origin: [55.749792, 37.632495], target: [38.8935965, -77.014576] });
  missiles.push({ origin: [30.8935965, -87.014576], target: [28.8935965, -107.014576] });

});
