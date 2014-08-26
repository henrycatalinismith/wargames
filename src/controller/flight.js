GlobalThermonuclearWar.Controller.Flight = Marionette.Controller.extend({

  initialize: function(options) {
    this.missiles = options.missiles;
    this.timeout = null;
    this.tick();
  },

  tick: function() {
    this.missiles
      .filter(function(missile) { return missile.get('status') === 'flight'; })
      .map(function(missile) { missile.tick(); });
    this.timeout = setTimeout(this.tick.bind(this), 100);
  }

});
