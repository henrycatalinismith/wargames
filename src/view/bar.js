GlobalThermonuclearWar.View.Info = Backbone.View.extend({

  initialize: function(options) {
    this.players = options.players;
    this.$playerCount = this.$('#count');
    this.listenTo(this.players, 'add', this.updatePlayerCount);
    this.listenTo(this.players, 'remove', this.updatePlayerCount);
  },

  updatePlayerCount: function() {
    this.$playerCount.text(this.players.length);
  }

});
