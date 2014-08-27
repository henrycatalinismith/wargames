GlobalThermonuclearWar.View.Bar = Backbone.View.extend({

  initialize: function(options) {
    this.$playerCount = this.$('.playerCountNumber');
  },

  updatePlayerCount: function(count) {
    this.$playerCount.text(count);
  }

});
