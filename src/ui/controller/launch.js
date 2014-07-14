define(['marionette'], function(Marionette) {

  var LaunchControl = Marionette.Controller.extend({

    initialize: function(options) {
      options.barrage.on('add', this.launchMissile);
    },

    launchMissile: function(missile) {
      missile.launch();
    }

  });

  return LaunchControl;
});
