GlobalThermonuclearWar.View.Info = Backbone.View.extend({

  initialize: function(options) {
    this.$playerCount = this.$('#count');
  },

  updatePlayerCount: function(count) {
    this.$playerCount.text(count);
  }

});
