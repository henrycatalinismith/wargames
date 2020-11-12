GlobalThermonuclearWar.Model.Player = Backbone.Model.extend({

  locate: function(latitude, longitude) {
    this.set('latitude', latitude);
    this.set('longitude', longitude);
    this.trigger('located', this);
  }

});
