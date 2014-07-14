define(['backbone', 'googlemaps!'], function(Backbone) {

  var Map = Backbone.View.extend({

    initialize: function(options) {
      var mapOptions = {
        center: new google.maps.LatLng(55.3617609, -3.4433238),
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
        scrollwheel: false,
        zoom: 3,
        zoomControl: false
      };

      this.map = new google.maps.Map(this.el, mapOptions);
    }

  });

  return Map;
});