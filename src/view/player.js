GlobalThermonuclearWar.View.Player = Backbone.View.extend({

  initialize: function(options) {
    this.map = options.map;
    this.player = options.player;
  },

  render: function() {
    this.marker = new google.maps.Circle({
      center: {
        lat: this.player.get('latitude'),
        lng: this.player.get('longitude')
      },
      map: this.map.map,
      clickable: false,
      strokeColor: '#002B36',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#B58900',
      radius: 40000,
      fillOpacity: 0.35
    });
  }

});
