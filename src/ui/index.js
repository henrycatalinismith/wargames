require.config({

  paths: {
    async: '/bower_components/requirejs-plugins/src/async',
    backbone: '/bower_components/backbone/backbone',
    googlemaps: '/bower_components/googlemaps-amd/src/googlemaps',
    gtw: '../',
    jquery: '/bower_components/jquery/dist/jquery',
    marionette: '/bower_components/marionette/lib/backbone.marionette',
    underscore: '/bower_components/underscore/underscore'
  },

  googlemaps: {
    key: 'AIzaSyDqRRPaAp8g_m5aOVqJpwMkrU7wV3yyhR0',
    libraries: 'geometry'
  },

  shim: {
    jquery:     { exports: 'jQuery' },
    underscore: { exports: '_' },
    backbone:   { exports: 'Backbone', deps: ['jquery', 'underscore'] },
    marionette: { exports: 'Marionette', deps: ['jquery', 'underscore', 'backbone'] }
  }

});

define(['gtw/ui/application'], function(UiApplication) {
  UiApplication.start();
});
