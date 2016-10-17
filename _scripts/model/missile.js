import Backbone from 'backbone';

const Missile = Backbone.Model.extend({

  initialize: function() {
    this.set('status', 'flight');
    this.set('location', [
      this.get('origin')[0],
      this.get('origin')[1]
    ]);
  },

  launch: function() {
    this.set('status', 'flight');
    this.trigger('launch', this);
  },

  detonate: function() {
    this.set('status', 'detonated');
    this.trigger('detonation', this);
  }

});

export default Missile;
