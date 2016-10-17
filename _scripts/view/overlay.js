import Backbone from 'backbone';

const Overlay = Backbone.View.extend({

  initialize: function(options) {
  },

  fadeOut: function(options) {
    this.$el.fadeOut();
  }

});

export default Overlay;
