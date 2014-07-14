define(['backbone', 'gtw/model/missile'], function(Backbone, Missile) {

  var Barrage = Backbone.Collection.extend({
    model: Missile
  });

  return Barrage;
});
