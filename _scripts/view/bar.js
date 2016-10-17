import Backbone from 'backbone';

const Bar = Backbone.View.extend({

  initialize: function(options) {
    this.players = options.players;
    this.$playerCount = this.$('#count');
    this.listenTo(this.players, 'add', this.updatePlayerCount);
    this.listenTo(this.players, 'remove', this.updatePlayerCount);
  },

  updatePlayerCount: function() {
    var locatedPlayers = this.players.filter(function(player) {
      return typeof player.get('latitude') !== 'undefined';
    });
    this.$playerCount.text(locatedPlayers.length);
  }

});

export default Bar;
