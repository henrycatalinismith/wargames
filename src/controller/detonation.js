GlobalThermonuclearWar.Controller.Detonation = Marionette.Controller.extend({

  initialize: function(options) {
    this.listenTo(options.missiles, 'change:location', this.checkDistance);
  },

  checkDistance: function(missile) {
    if (this.withinRange.apply(missile)) {
      missile.detonate();
    }
  },

  withinRange: function() {
    var remaining = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.get('location')[0], this.get('location')[1]),
      new google.maps.LatLng(this.get('target')[0], this.get('target')[1])
    );
    return remaining < 10000;
  }

});
