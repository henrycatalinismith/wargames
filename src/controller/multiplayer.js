GlobalThermonuclearWar.Controller.Multiplayer = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;

    this.player = options.player;
    this.listenTo(this.player, 'located', this.registerLocation);

    this.missiles = options.missiles;
    this.listenTo(options.missiles, 'launch', this.sendMissile);

    this.socket = this.setupSocket(options.url);
    this.socket.on('launch', this.receiveMissile.bind(this));
    this.socket.on('player:located', this.addPlayer.bind(this));
    this.socket.on('player:left', this.removePlayer.bind(this));

    this.players = options.players;
    this.listenTo(this.players, 'add', this.showPlayer);
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

  registerLocation: function(player) {
    console.log(player.toJSON());
    this.socket.emit('player:located', player.toJSON());
  },

  addPlayer: function(rawPlayerData) {
    console.log(rawPlayerData);
    this.players.push(new GlobalThermonuclearWar.Model.Player(rawPlayerData));
  },

  removePlayer: function(playerId) {
    console.log(playerId);
  },

  showPlayer: function(player) {
    console.log(player);
    var view = new GlobalThermonuclearWar.View.Player({
      map: this.map,
      player: player
    });
    view.render();
  },


});
