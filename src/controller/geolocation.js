GlobalThermonuclearWar.Controller.Geolocation = Marionette.Controller.extend({

  initialize: function(options) {
    this.bar = options.bar;
    this.map = options.map;
    this.overlay = options.overlay;
    this.player = options.player;

    this.listenTo(this.player, 'located', this.centerMapOnPlayer);
  },

  locateUser: function() {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationFailure.bind(this)
    );
  },

  geolocationSuccess: function(position) {
    var that = this;
    this.player.locate(position.coords.latitude, position.coords.longitude);
    setTimeout(function() {
      that.overlay.fadeOut()
      that.bar.hide();
    }, 500);
  },

  geolocationFailure: function(error) {
    var that = this;
    this.bar.hide();
    this.player.locate(55.751244, 37.618423);
    setTimeout(function() {
      that.overlay.fadeOut();
      setTimeout(function() {
        that.bar.hide();
      }, 500);
    }, 500);
  },

  centerMapOnPlayer: function() {
    this.map.map.setCenter(
      new google.maps.LatLng(
        this.player.get('latitude'),
        this.player.get('longitude')
      )
    );
    this.map.map.setZoom(3);
  }

});
