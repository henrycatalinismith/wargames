define([
  'marionette',
  'jquery',
  'gtw/ui/view/map',
  'gtw/ui/controller/launch',
  'gtw/collection/barrage',
  'gtw/model/missile'
], function(Marionette, $, Map, LaunchControl, Barrage, Missile) {

  var Application = new Marionette.Application;

  Application.addInitializer(function(options) {
    var map = new Map({
      el: $('#map')
    });

    launchSite = new google.maps.LatLng(55.749792, 37.632495);
    target = new google.maps.LatLng(38.8935965, -77.014576);

    var trajectory = new google.maps.Polyline({
      geodesic: true,
      map: map.map,
      path: [launchSite, target],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    });

    var explosion = new google.maps.Circle({
      center: target,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map.map,
      radius: 100000,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

  });

  return Application;
});
