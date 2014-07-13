define(['backbone', 'model/missile'], function(Backbone, Missile) {

  var MissileCollection = Backbone.Collection.extend({
    model: Missile
  });

  return MissileCollection;
});
