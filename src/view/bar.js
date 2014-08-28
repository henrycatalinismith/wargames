GlobalThermonuclearWar.View.Bar = Backbone.View.extend({

  initialize: function(options) {
    this.$playerCountText = this.$('#playerCountText');
    this.$playerCount = this.$('.playerCountNumber');
  },

  hide: function(count) {
    this.$el.fadeOut(1500);
  },

  updatePlayerCount: function(count) {
    this.$playerCount.text(count);
  }

});
