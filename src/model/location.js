define(['backbone'], function(Backbone) {

  var Location = Backbone.Model.extend({

    defaults: {
      latitude: 0.000000,
      longitude: 0.000000
    }

  });

  return Location;
});
