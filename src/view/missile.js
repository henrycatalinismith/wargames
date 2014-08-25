GlobalThermonuclearWar.View.Missile = Backbone.View.extend({

  initialize: function(options) {
    this.origin = new google.maps.LatLng(
      this.model.get('origin')[0],
      this.model.get('origin')[1]
    );

    this.target = new google.maps.LatLng(
      this.model.get('target')[0],
      this.model.get('target')[1]
    );

    this.line = new google.maps.Polyline({
      geodesic: true,
      map: options.map.map,
      path: [this.origin, this.origin],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    });

    this.model.on('change', function() {
      console.log('ee');
    });
  }

});
