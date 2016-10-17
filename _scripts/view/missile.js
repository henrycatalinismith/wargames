import Backbone from 'backbone';

const Missile = Backbone.View.extend({

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
      clickable: false,
      map: options.map.map,
      path: [this.origin, this.origin],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    });

    this.listenTo(this.model, 'change:location', this.render);
    this.listenTo(this.model, 'detonation', this.explode);
  },

  render: function() {
    var location = new google.maps.LatLng(
      this.model.get('location')[0],
      this.model.get('location')[1]
    );
    this.line.setPath([this.origin, location]);
  },

  explode: function() {
    this.stopListening();
    setTimeout(this.disappear.bind(this), 1000);
  },

  disappear: function() {
    this.line.setMap(null);
  }

});

export default Missile;
