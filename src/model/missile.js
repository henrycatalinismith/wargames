GlobalThermonuclearWar.Model.Missile = Backbone.Model.extend({
  initialize: function() {
    this.set('location', [
      this.get('origin')[0],
      this.get('origin')[1]
    ]);
  }
});
