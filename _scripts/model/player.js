import Backbone from 'backbone';

const Player = Backbone.Model.extend({

  locate: function(latitude, longitude) {
    this.set('latitude', latitude);
    this.set('longitude', longitude);
    this.trigger('located', this);
  }

});

export default Player;
