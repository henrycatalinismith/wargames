GlobalThermonuclearWar.Controller.Detonation = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;
    this.explosions = options.explosions;
    this.missiles = options.missiles;

    this.listenTo(this.missiles, 'change:location', this.checkDistance);
    this.listenTo(this.missiles, 'detonation', this.createExplosion);
    this.listenTo(this.explosions, 'add', this.showExplosion);
  },

  checkDistance: function(missile) {
    if (this.withinRange.apply(missile)) {
      missile.detonate();
    }
  },

  createExplosion: function(missile) {
    this.explosions.push({
      latitude: missile.get('target')[0],
      longitude: missile.get('target')[1]
    });
    this.missiles.remove(missile);
  },

  showExplosion: function(explosion) {
    var view = new GlobalThermonuclearWar.View.Explosion({
      map: this.map,
      model: explosion
    });
    view.render();
    setTimeout(function() { view.hide(); view.remove(); }, (5 * 60 * 1000));
  },

  withinRange: function() {
    var remaining = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.get('location')[0], this.get('location')[1]),
      new google.maps.LatLng(this.get('target')[0], this.get('target')[1])
    );
    return remaining < 10000;
  }

});
