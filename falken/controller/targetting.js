GlobalThermonuclearWar.Controller.Targetting = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;
    this.missiles = options.missiles;
    this.player = options.player;
    this.waiting = false;

    google.maps.event.addListener(this.map.map, 'click', this.handleClick.bind(this));
  },

  handleClick: function(event) {
    var that = this;
    if (!this.waiting) {
      this.launchMissile(event);
      setTimeout(function() { that.waiting = false; }, 600);
      this.waiting = true;
    }
  },

  launchMissile: function(event) {
    var missile = new GlobalThermonuclearWar.Model.Missile({
      origin: [this.player.get('latitude'), this.player.get('longitude')],
      target: [event.latLng.lat(), event.latLng.lng()]
    });
    this.trackLaunch(event);
    this.missiles.push(missile);
    missile.launch();
  },

  trackLaunch: function(event) {
    ga('send', 'event', 'missile', 'launch');
  }

});
