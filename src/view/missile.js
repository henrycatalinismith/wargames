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

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    var location = new google.maps.LatLng(
      this.model.get('location')[0],
      this.model.get('location')[1]
    );
    this.line.setPath([this.origin, location]);
  }

});
