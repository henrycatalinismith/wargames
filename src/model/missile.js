define(['backbone', 'model/location'], function(Backbone, Location) {

  var Missile = Backbone.Model.extend({

    defaults: {
      origin: new Location,
      target: new Location,
      position: new Location,
      status: 'ready',
    },

    fire: function() {
      if (this.get('status') === 'ready') {
        this.set({ status: 'flight' });
      } else {
        throw new Error('Cannot fire missiles that are not ready');
      }
    }

  });

  return Missile;
});
