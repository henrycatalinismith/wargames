GlobalThermonuclearWar.Controller.Multiplayer = Marionette.Controller.extend({

  initialize: function(options) {
    this.missiles = options.missiles;
    this.socket = this.setupSocket(options.url);
    this.socket.on('launch', this.receiveMissile.bind(this));
    this.listenTo(options.missiles, 'launch', this.sendMissile);
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
  }

});
