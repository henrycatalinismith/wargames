GlobalThermonuclearWar.Controller.Multiplayer = Marionette.Controller.extend({

  initialize: function(options) {
    this.missiles = options.missiles;
    this.listenTo(options.missiles, 'launch', this.sendMissile);

    this.socket = this.setupSocket(options.url);
    this.socket.on('launch', this.receiveMissile.bind(this));
    this.socket.on('player:joined', this.addPlayer.bind(this));
    this.socket.on('player:left', this.removePlayer.bind(this));
  },

  setupSocket: function(url) {
    if (url.match(/^http:\/\/localhost/)) {
      return io('http://localhost:3000');
    } else {
      return io('http://global.thermonuclearwar.org:3000');
    }
  },

  sendMissile: function(missile) {
    this.socket.emit('launch', missile.toJSON());
  },

  receiveMissile: function(rawMissileData) {
    this.missiles.push(new GlobalThermonuclearWar.Model.Missile(rawMissileData));
  },

  addPlayer: function(rawPlayerData) {
    console.log(rawPlayerData);
  },

  removePlayer: function(playerId) {
    console.log(playerId);
  }

});
