GlobalThermonuclearWar.View.Explosion = Backbone.View.extend({

  initialize: function(options) {
    this.map = options.map;
  },

  render: function() {
    this.explosion = new google.maps.Circle({
      center: {
        lat: this.model.get('latitude'),
        lng: this.model.get('longitude')
      },
      clickable: false,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map.map,
      radius: 100000,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });
  },

  hide: function() {
    this.explosion.setMap(null);
    delete this.explosion;
  },

});
