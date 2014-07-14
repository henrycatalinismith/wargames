define(['backbone', 'gtw/model/missile'], function(Backbone, Missile) {

  var MissileCollection = Backbone.Collection.extend({
    model: Missile
  });

  return MissileCollection;
});
