define(['marionette'], function(Marionette) {

  var LaunchControl = Marionette.Controller.extend({

    initialize: function(options) {
      options.barrage.on('add', this.launchMissile);
    },

    launchMissile: function(missile) {
      missile.launch();
      missile.set({ speed: 5000 });
    }

  });

  return LaunchControl;
});
