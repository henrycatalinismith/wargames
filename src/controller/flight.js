GlobalThermonuclearWar.Controller.Flight = Marionette.Controller.extend({

  initialize: function(options) {
    var that = this;
    this.map = options.map;
    this.missiles = options.missiles;

    function tick(length) {
      options.missiles
        .filter(function(missile) { return missile.get('status') === 'flight'; })
        .map(function(missile) { that.moveMissile(missile); });
      setTimeout(tick, length);
    }
    tick(100);

    this.listenTo(this.missiles, 'add', this.showMissile);
  },

  showMissile: function(missile) {
    var view = new GlobalThermonuclearWar.View.Missile({
      map: this.map,
      model: missile
    });
  },

  moveMissile: function(missile) {
    var tickLength = 10;
    var speed = 1000 + Math.min(this.missiles.length * 10, 999);
    var elapsed = tickLength;
    var distance = speed * elapsed;
    var origin = new google.maps.LatLng(missile.get('origin')[0], missile.get('origin')[1]);
    var target = new google.maps.LatLng(missile.get('target')[0], missile.get('target')[1]);
    var location = new google.maps.LatLng(missile.get('location')[0], missile.get('location')[1]);
    var heading = google.maps.geometry.spherical.computeHeading(location, target);
    location = google.maps.geometry.spherical.computeOffset(location, distance, heading);
    missile.set('location', [location.lat(), location.lng()]);
  }

});
