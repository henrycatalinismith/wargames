GlobalThermonuclearWar.Model.Missile = Backbone.Model.extend({

  initialize: function() {
    this.set('status', 'flight');
    this.set('location', [
      this.get('origin')[0],
      this.get('origin')[1]
    ]);
  },

  detonate: function() {
    this.set('status', 'detonated');
    this.trigger('detonation', this);
  },

  tick: function() {
    var tickLength = 10;
    var speed = 1000;
    var elapsed = tickLength;
    var distance = speed * elapsed;
    var origin = new google.maps.LatLng(this.get('origin')[0], this.get('origin')[1]);
    var target = new google.maps.LatLng(this.get('target')[0], this.get('target')[1]);
    var location = new google.maps.LatLng(this.get('location')[0], this.get('location')[1]);
    var heading = google.maps.geometry.spherical.computeHeading(location, target);

    location = google.maps.geometry.spherical.computeOffset(location, distance, heading);
    this.set('location', [location.lat(), location.lng()]);
  }

});
