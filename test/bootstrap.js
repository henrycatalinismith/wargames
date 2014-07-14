var requirejs = require('requirejs')
  , mocha = require('mocha')
  , fs = require('fs');

requirejs.config({
  baseUrl: fs.realpathSync(__dirname + "/../src"),
  nodeRequire: require,

  paths: {
    gtw: fs.realpathSync(__dirname + "/../src")
  }
});

requirejs.define("assert", function() { return require("assert"); });
requirejs.define("mocha", function() { return require("mocha"); });
requirejs.define("should", function() { return require("should"); });
requirejs.define("sinon", function() { return require("sinon"); });

requirejs([
  "jquery",
  "backbone"
], function(jQuery, Backbone) {
  Backbone.$ = jQuery;
});

