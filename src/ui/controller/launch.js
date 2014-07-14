define(['googlemaps!'], function() {

  var LaunchController = function(map) {
    this.map = map;
  };

  LaunchController.prototype.fireMissile = function(launchSite, target) {
    launchSite = new google.maps.LatLng(launchSite[0], launchSite[1]);
    target = new google.maps.LatLng(target[0], target[1]);

    var trajectory = new google.maps.Polyline({
      geodesic: true,
      map: this.map.map,
      path: [launchSite, target],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    });

    var explosion = new google.maps.Circle({
      center: target,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map.map,
      radius: 100000,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

  }

  return LaunchController;
});
