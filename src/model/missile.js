define(['backbone', 'model/location'], function(Backbone, Location) {

  var Missile = Backbone.Model.extend({

    defaults: {
      origin: new Location,
      target: new Location,
      position: new Location,
      status: 'ready',
    }

  });

  return Missile;
});
