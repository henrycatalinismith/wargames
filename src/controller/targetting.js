GlobalThermonuclearWar.Controller.Targetting = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;
    this.missiles = options.missiles;
    this.player = options.player;

    google.maps.event.addListener(this.map.map, 'click', this.trackLaunch.bind(this));
    google.maps.event.addListener(this.map.map, 'click', this.launchMissile.bind(this));
  },

  trackLaunch: function(event) {
    ga('send', 'event', 'missile', 'launch');
  },

  launchMissile: function(event) {
    var missile = new GlobalThermonuclearWar.Model.Missile({
      origin: [this.player.get('latitude'), this.player.get('longitude')],
      target: [event.latLng.lat(), event.latLng.lng()]
    });
    this.missiles.push(missile);
    missile.launch();
  }

});
