GlobalThermonuclearWar.Controller.Multiplayer = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;
    this.bar = options.bar;
    this.count = 0;

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
    this.socket.emit('launch', missile.toJSON());
  },

  receiveMissile: function(rawMissileData) {
    if (this.missiles.length < 150 ) {
      this.missiles.push(new GlobalThermonuclearWar.Model.Missile(rawMissileData));
    }
  },

  registerLocation: function(player) {
    this.socket.emit('player:located', player.toJSON());
  },

  addPlayer: function(rawPlayerData) {
    this.count++;
    this.bar.updatePlayerCount(this.count);
    this.players.push(new GlobalThermonuclearWar.Model.Player(rawPlayerData));
  },

  removePlayer: function(playerId) {
    this.count--;
    this.bar.updatePlayerCount(this.count);
  },

  showPlayer: function(player) {
    this.playerViews[player.get('id')] = new GlobalThermonuclearWar.View.Player({
      map: this.map,
      player: player
    });
    this.playerViews[player.get('id')].render();
  },


});
