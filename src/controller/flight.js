GlobalThermonuclearWar.Controller.Flight = Marionette.Controller.extend({

  initialize: function(options) {
    function tick(length) {
      options.missiles
        .filter(function(missile) { return missile.get('status') === 'flight'; })
        .map(function(missile) { missile.tick(); });
      setTimeout(tick, length);
    }
    tick(100);
  }

});
