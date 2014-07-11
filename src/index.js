document.addEventListener('DOMContentLoaded', function() {
  var mapOptions = {
    center: new google.maps.LatLng(55.3617609, -3.4433238),
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
  //map.fitBounds(worldBounds);

  var dept_lat = 55.749792;
  var dept_lng = 37.632495;
  var arr_lat = 38.8935965;
  var arr_lng = -77.014576;

  var departure = new google.maps.LatLng(dept_lat, dept_lng); //Set to whatever lat/lng you need for your departure location
 var arrival = new google.maps.LatLng(arr_lat, arr_lng); //Set to whatever lat/lng you need for your arrival location
  var line = new google.maps.Polyline({
      path: [departure, departure],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1,
      geodesic: true, //set to false if you want straight line instead of arc
      map: map,
 });
 var step = 0;
 var numSteps = 250; //Change this to set animation resolution
 var timePerStep = 5; //Change this to alter animation speed
 var interval = setInterval(function() {
     step += 1;
     if (step > numSteps) {
         clearInterval(interval);
     } else {
         var are_we_there_yet = google.maps.geometry.spherical.interpolate(departure,arrival,step/numSteps);
         line.setPath([departure, are_we_there_yet]);
     }
 }, timePerStep);

});
