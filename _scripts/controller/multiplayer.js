import Marionette from 'backbone.marionette';
import _ from 'underscore';
import PlayerView from '../view/player';
import Missile from '../model/missile';
import Player from '../model/player';

const Multiplayer = Marionette.Object.extend({

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
        player = new Player(player);
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
      this.missiles.push(new Missile(rawMissileData));
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
    this.playerViews[player.get('id')] = new PlayerView({
      map: this.map,
      player: player
    });
    this.playerViews[player.get('id')].render();
  },


});

export default Multiplayer;
