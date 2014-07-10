document.addEventListener('DOMContentLoaded', function() {
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 3
  };
  var worldBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(0, -110),
    new google.maps.LatLng(0, 110)
  );
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  map.fitBounds(worldBounds);
});
