document.addEventListener('DOMContentLoaded', function() {
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: false,
    scrollwheel: false,
    zoom: 3,
    zoomControl: false
  };
  var worldBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(0, -110),
    new google.maps.LatLng(0, 110)
  );
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  map.fitBounds(worldBounds);
});
