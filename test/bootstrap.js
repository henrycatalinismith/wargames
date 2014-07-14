requirejs.config({
  paths: {
    gtw: '../src',
    test: './',

    backbone: '../bower_components/backbone/backbone',
    jquery: '../bower_components/jquery/dist/jquery',
    marionette: '../bower_components/marionette/lib/backbone.marionette',
    underscore: '../bower_components/underscore/underscore',
    mocha: '../bower_components/mocha/mocha',
    sinon: '../bower_components/sinon/lib/sinon',
    should: '../bower_components/should/should'
  },

  shim: {

    underscore: { exports: '_' },
    backbone:   { exports: 'Backbone', deps: ['jquery', 'underscore'] },
    marionette: { exports: 'Marionette', deps: ['jquery', 'underscore', 'backbone'] },

    'mocha': {
      init: function () {
        this.mocha.setup('bdd');
        return this.mocha;
      }
    }
  }
});

require(['mocha', 'should', 'test/model/missile', 'test/ui/controller/launch'], function(mocha) {
  mochaPhantomJS.run();
});

