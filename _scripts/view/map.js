import Backbone from 'backbone';

const Map = Backbone.View.extend({

  initialize: function(options) {
    var mapOptions = {
      center: new google.maps.LatLng(55.3617609, -3.4433238),
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      draggable: true,
      draggableCursor: 'crosshair',
      scrollwheel: true,
      zoom: 2,
      zoomControl: true
    };
    this.map = new google.maps.Map(this.el, mapOptions);
  }

});

export default Map;
