//= require bower_components/jquery/dist/jquery
//= require bower_components/underscore/underscore
//= require bower_components/backbone/backbone
//= require src/map

$(document).ready(function() {

  var map = new Map({
    el: $('#map')
  });


  var origin = new google.maps.LatLng(55.749792, 37.632495);
  var target = new google.maps.LatLng(38.8935965, -77.014576);
  var location = origin;

  var heading = google.maps.geometry.spherical.computeHeading(origin, target);
  console.log(heading);

  var line = new google.maps.Polyline({
    geodesic: true,
      map: map.map,
      path: [origin, location],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
  });

  var tickLength = 10;
  function move() {
    var speed = 1000;
    var elapsed = tickLength;
    var distance = speed * elapsed;
    var heading = google.maps.geometry.spherical.computeHeading(location, target);
    location = google.maps.geometry.spherical.computeOffset(location, distance, heading);
    line.setPath([origin, location]);

    var remaining = google.maps.geometry.spherical.computeDistanceBetween(location, target);
    if (remaining > 10000) {
      setTimeout(move, tickLength);
    } else {
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
    }
  }

  move();

});
