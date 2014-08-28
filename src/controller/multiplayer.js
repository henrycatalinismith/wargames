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

    this.socket.on('broadcast:launch', this.receiveMissile.bind(this));
    this.socket.on('broadcast:entrance', this.addPlayer.bind(this));
    this.socket.on('broadcast:location', this.receiveLocation.bind(this));
    this.socket.on('broadcast:exit', this.removePlayer.bind(this));


    this.playerViews = {};
  },

  setupSocket: function(url) {
    if (url.match(/^http:\/\/localhost/)) {
      //return io('http://global.thermonuclearwar.org:3000');
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
    console.log('showing', player);
    this.playerViews[player.get('id')] = new GlobalThermonuclearWar.View.Player({
      map: this.map,
      player: player
    });
    this.playerViews[player.get('id')].render();
  },


});
