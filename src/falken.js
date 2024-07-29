var GlobalThermonuclearWar = {
  Collection: {},
  Controller: {},
  Model: {},
  View: {}
};

GlobalThermonuclearWar.Model.Explosion = Backbone.Model.extend({
  initialize: function() {
  }
});

GlobalThermonuclearWar.Model.Missile = Backbone.Model.extend({
  initialize: function() {
    this.set('status', 'flight');
    this.set('location', [
      this.get('origin')[0],
      this.get('origin')[1]
    ]);
  },

  launch: function() {
    this.set('status', 'flight');
    this.trigger('launch', this);
  },

  detonate: function() {
    this.set('status', 'detonated');
    this.trigger('detonation', this);
  }
});

GlobalThermonuclearWar.Model.Player = Backbone.Model.extend({
  locate: function(latitude, longitude) {
    this.set('latitude', latitude);
    this.set('longitude', longitude);
    this.trigger('located', this);
  }
});

GlobalThermonuclearWar.Collection.Explosion = Backbone.Collection.extend({
  model: GlobalThermonuclearWar.Model.Explosion
});

GlobalThermonuclearWar.Collection.Missile = Backbone.Collection.extend({
  model: GlobalThermonuclearWar.Model.Missile
});

GlobalThermonuclearWar.Collection.Player = Backbone.Collection.extend({
  model: GlobalThermonuclearWar.Model.Player
});

GlobalThermonuclearWar.Controller.Detonation = Marionette.Controller.extend({
  initialize: function(options) {
    this.map = options.map;
    this.explosions = options.explosions;
    this.missiles = options.missiles;

    this.listenTo(this.missiles, 'change:location', this.checkDistance);
    this.listenTo(this.missiles, 'detonation', this.createExplosion);
    this.listenTo(this.explosions, 'add', this.showExplosion);
  },

  checkDistance: function(missile) {
    if (this.withinRange.apply(missile)) {
      missile.detonate();
    }
  },

  createExplosion: function(missile) {
    this.explosions.push({
      latitude: missile.get('target')[0],
      longitude: missile.get('target')[1]
    });
    this.missiles.remove(missile);
  },

  showExplosion: function(explosion) {
    var view = new GlobalThermonuclearWar.View.Explosion({
      map: this.map,
      model: explosion
    });
    view.render();
    setTimeout(function() { view.hide(); view.remove(); }, (5 * 60 * 1000));
  },

  withinRange: function() {
    var remaining = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.get('location')[0], this.get('location')[1]),
      new google.maps.LatLng(this.get('target')[0], this.get('target')[1])
    );
    return remaining < 10000;
  }
});

GlobalThermonuclearWar.Controller.Flight = Marionette.Controller.extend({
  initialize: function(options) {
    var that = this;
    this.map = options.map;
    this.missiles = options.missiles;

    function tick(length) {
      options.missiles
        .filter(function(missile) { return missile.get('status') === 'flight'; })
        .map(function(missile) { that.moveMissile(missile); });
      setTimeout(tick, length);
    }
    tick(100);

    this.listenTo(this.missiles, 'add', this.showMissile);
  },

  showMissile: function(missile) {
    var view = new GlobalThermonuclearWar.View.Missile({
      map: this.map,
      model: missile
    });
  },

  moveMissile: function(missile) {
    var tickLength = 10;
    var speed = 1000 + Math.min(this.missiles.length * 10, 999);
    var elapsed = tickLength;
    var distance = speed * elapsed;
    var origin = new google.maps.LatLng(missile.get('origin')[0], missile.get('origin')[1]);
    var target = new google.maps.LatLng(missile.get('target')[0], missile.get('target')[1]);
    var location = new google.maps.LatLng(missile.get('location')[0], missile.get('location')[1]);
    var heading = google.maps.geometry.spherical.computeHeading(location, target);
    location = google.maps.geometry.spherical.computeOffset(location, distance, heading);
    missile.set('location', [location.lat(), location.lng()]);
  }
});

GlobalThermonuclearWar.Controller.Geolocation = Marionette.Controller.extend({
  initialize: function(options) {
    this.map = options.map;
    this.overlay = options.overlay;
    this.player = options.player;

    this.listenTo(this.player, 'located', this.centerMapOnPlayer);

    this.fallbackLocations = {
      moscow: [55.751244, 37.618423],
      norad: [38.744332, -104.82772]
    };
  },

  locateUser: function() {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationFailure.bind(this),
      { timeout: 4000 }
    );
  },

  geolocationSuccess: function(position) {
    var that = this;
    this.player.locate(position.coords.latitude, position.coords.longitude);
    setTimeout(function() {
      that.overlay.fadeOut()
    }, 500);
  },

  geolocationFailure: function(error) {
    var that = this;
    var coords = _.sample(_.values(this.fallbackLocations));
    this.player.locate(coords[0], coords[1]);
    setTimeout(function() {
      that.overlay.fadeOut();
    }, 500);
  },

  centerMapOnPlayer: function() {
    this.map.map.setCenter(
      new google.maps.LatLng(
        this.player.get('latitude'),
        this.player.get('longitude')
      )
    );
    this.map.map.setZoom(3);
  }
});

GlobalThermonuclearWar.Controller.Multiplayer = Marionette.Controller.extend({
  initialize: function(options) {
    this.map = options.map;
    this.info = options.info;
    this.count = 0;

    this.player = options.player;
    this.listenTo(this.player, 'located', this.registerLocation);

    this.missiles = options.missiles;
    this.listenTo(options.missiles, 'launch', this.sendMissile);

    this.socket = this.setupSocket(options.url);

    var that = this;

    this.socket.on('reconnect', function() {
      that.registerLocation();
    });

    this.socket.on('reconnect_error', function() {
      _.map(that.playerViews, function(view) {
        view.hide();
      });
    });

    this.socket.on('broadcast:launch', this.receiveMissile.bind(this));
    this.socket.on('broadcast:entrance', this.addPlayer.bind(this));
    this.socket.on('broadcast:location', this.receiveLocation.bind(this));
    this.socket.on('broadcast:exit', this.removePlayer.bind(this));

    this.players = options.players;
    this.socket.on('initialize:player', function(playerData) {
      that.player.set(playerData);
    });

    this.socket.on('initialize:opponents', function(players) {
      that.players.reset();
      that.players.add(that.player);
      _.values(players).map(function(player) {
        player = new GlobalThermonuclearWar.Model.Player(player);
        that.players.add(player);
        if (typeof player.get('latitude') !== 'undefined') {
          that.showPlayer(player);
        }
      });
    });


    this.playerViews = {};
  },

  setupSocket: function(url) {
    if (url.match(/^http:\/\/localhost/)) {
      return io('http://localhost:3000');
    } else {
      return io('http://global.thermonuclearwar.org:3000');
    }
  },

  sendMissile: function(missile) {
    this.socket.emit('report:launch', missile.toJSON());
  },

  receiveMissile: function(rawMissileData) {
    if (this.missiles.length < 300 ) {
      this.missiles.push(new GlobalThermonuclearWar.Model.Missile(rawMissileData));
    }
  },

  registerLocation: function() {
    this.showPlayer(this.player);
    this.socket.emit('report:location', this.player.toJSON());
  },

  addPlayer: function(rawPlayerData) {
    if (!this.players.findWhere({ id: rawPlayerData.id })) {
      this.players.push(rawPlayerData);
    }
  },

  removePlayer: function(playerId) {
    var player = this.players.findWhere({ id: playerId });
    if (player) {
      this.players.remove(player);
      if (this.playerViews[player.get('id')]) {
        this.playerViews[player.get('id')].hide();
      }
    }
  },

  receiveLocation: function(rawPlayerData) {
    var player = this.players.findWhere({ id: rawPlayerData.id });
    if (player) {
      player.set(rawPlayerData);
      this.showPlayer(player);
    }
  },

  showPlayer: function(player) {
    this.playerViews[player.get('id')] = new GlobalThermonuclearWar.View.Player({
      map: this.map,
      player: player
    });
    this.playerViews[player.get('id')].render();
  },
});

GlobalThermonuclearWar.Controller.Targetting = Marionette.Controller.extend({
  initialize: function(options) {
    this.map = options.map;
    this.missiles = options.missiles;
    this.player = options.player;
    this.waiting = false;

    google.maps.event.addListener(this.map.map, 'click', this.handleClick.bind(this));
  },

  handleClick: function(event) {
    var that = this;
    if (!this.waiting) {
      this.launchMissile(event);
      setTimeout(function() { that.waiting = false; }, 600);
      this.waiting = true;
    }
  },

  launchMissile: function(event) {
    var missile = new GlobalThermonuclearWar.Model.Missile({
      origin: [this.player.get('latitude'), this.player.get('longitude')],
      target: [event.latLng.lat(), event.latLng.lng()]
    });
    this.trackLaunch(event);
    this.missiles.push(missile);
    missile.launch();
  },

  trackLaunch: function(event) {
    ga('send', 'event', 'missile', 'launch');
  }
});

GlobalThermonuclearWar.View.Info = Backbone.View.extend({
  initialize: function(options) {
    this.players = options.players;
    this.$playerCount = this.$('#count');
    this.listenTo(this.players, 'add', this.updatePlayerCount);
    this.listenTo(this.players, 'remove', this.updatePlayerCount);
  },

  updatePlayerCount: function() {
    var locatedPlayers = this.players.filter(function(player) {
      return typeof player.get('latitude') !== 'undefined';
    });
    this.$playerCount.text(locatedPlayers.length);
  }
});

GlobalThermonuclearWar.View.Explosion = Backbone.View.extend({
  initialize: function(options) {
    this.map = options.map;
  },

  render: function() {
    this.explosion = new google.maps.Circle({
      center: {
        lat: this.model.get('latitude'),
        lng: this.model.get('longitude')
      },
      clickable: false,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map.map,
      radius: 100000,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });
  },

  hide: function() {
    this.explosion.setMap(null);
    delete this.explosion;
  },
});

GlobalThermonuclearWar.View.Map = Backbone.View.extend({
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

GlobalThermonuclearWar.View.Missile = Backbone.View.extend({
  initialize: function(options) {
    this.origin = new google.maps.LatLng(
      this.model.get('origin')[0],
      this.model.get('origin')[1]
    );

    this.target = new google.maps.LatLng(
      this.model.get('target')[0],
      this.model.get('target')[1]
    );

    this.line = new google.maps.Polyline({
      geodesic: true,
      clickable: false,
      map: options.map.map,
      path: [this.origin, this.origin],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    });

    this.listenTo(this.model, 'change:location', this.render);
    this.listenTo(this.model, 'detonation', this.explode);
  },

  render: function() {
    var location = new google.maps.LatLng(
      this.model.get('location')[0],
      this.model.get('location')[1]
    );
    this.line.setPath([this.origin, location]);
  },

  explode: function() {
    this.stopListening();
    setTimeout(this.disappear.bind(this), 1000);
  },

  disappear: function() {
    this.line.setMap(null);
  }
});

GlobalThermonuclearWar.View.Overlay = Backbone.View.extend({
  initialize: function(options) {
  },

  fadeOut: function(options) {
    this.$el.fadeOut();
  }
});

GlobalThermonuclearWar.View.Player = Backbone.View.extend({
  initialize: function(options) {
    this.map = options.map;
    this.player = options.player;
  },

  render: function() {
    this.marker = new google.maps.Circle({
      center: {
        lat: this.player.get('latitude'),
        lng: this.player.get('longitude')
      },
      map: this.map.map,
      clickable: false,
      strokeColor: '#002B36',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#B58900',
      radius: 30000,
      fillOpacity: 0.35
    });
  },

  hide: function() {
    this.marker.setMap(null);
  }
});

$(document).ready(function() {

  var overlay = new GlobalThermonuclearWar.View.Overlay({
    el: $('#overlay')
  });

  var map = new GlobalThermonuclearWar.View.Map({
    el: $('#map')
  });

  var players = new GlobalThermonuclearWar.Collection.Player;
  var missiles = new GlobalThermonuclearWar.Collection.Missile;
  var explosions = new GlobalThermonuclearWar.Collection.Explosion;

  var player = new GlobalThermonuclearWar.Model.Player;
  players.push(player);

  var info = new GlobalThermonuclearWar.View.Info({
    el: $('#icons'),
    players: players
  });

  var multiplayerController = new GlobalThermonuclearWar.Controller.Multiplayer({
    url: window.location.href,
    info: info,
    map: map,
    missiles: missiles,
    player: player,
    players: players
  });

  var geolocationController = new GlobalThermonuclearWar.Controller.Geolocation({
    map: map,
    overlay: overlay,
    player: player
  });

  geolocationController.locateUser();

  var targettingController = new GlobalThermonuclearWar.Controller.Targetting({
    map: map,
    missiles: missiles,
    player: player
  });

  var flightController = new GlobalThermonuclearWar.Controller.Flight({
    map: map,
    missiles: missiles
  });

  var detonationController = new GlobalThermonuclearWar.Controller.Detonation({
    map: map,
    explosions: explosions,
    missiles: missiles
  });

});

