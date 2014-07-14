define(['backbone'], function(Backbone) {

  var Missile = Backbone.Model.extend({

    defaults: {
      status: 'ready',
      speed: 0,
      heading: 0,
      origin: [0, 0],
      target: [0, 0],
      location: [0, 0]
    },

    launch: function() {
      if (this.get('status') === 'ready') {
        this.set({ status: 'flight' });
        this.trigger('launch');
      } else {
        throw new Error('Cannot launch missiles that are not ready');
      }
    },

    detonate: function() {
      if (this.get('status') === 'flight') {
        this.set({ status: 'detonated' });
      } else {
        throw new Error('Cannot detonate missiles that are not in flight');
      }
    }

  });

  return Missile;
});
