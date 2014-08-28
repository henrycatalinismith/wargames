GlobalThermonuclearWar.View.Bar = Backbone.View.extend({

  initialize: function(options) {
    this.$playerCountText = this.$('#playerCountText');
    this.$playerCount = this.$('.playerCountNumber');
    setTimeout(this.hidePlayerCount.bind(this), 10000);
  },

  hidePlayerCount: function(count) {
    this.$playerCountText.fadeOut(5000);
  },

  updatePlayerCount: function(count) {
    this.$playerCount.text(count);
  }

});
