GlobalThermonuclearWar.Controller.Geolocation = Marionette.Controller.extend({

  initialize: function(options) {
    this.overlay = options.overlay;
    this.player = options.player;
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
    setTimeout(function() { that.overlay.fadeOut() }, 500);
  },

  geolocationFailure: function(error) {
    var that = this;
    this.player.locate(51.389122, 30.104233);
    setTimeout(function() { that.overlay.fadeOut() }, 500);
  }

});
