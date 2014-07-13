define(['googlemaps!'], function() {
  var Map = function() {

    var mapOptions = {
      center: new google.maps.LatLng(55.3617609, -3.4433238),
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      draggable: false,
      scrollwheel: false,
      zoom: 3,
      zoomControl: false
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  }

  return Map;
});
