var server = require('http').Server();
var Guid = require('guid');
var io = require('socket.io')(server);
var _ = require('underscore');

var players = {};

io.on('connection', function(socket){
  socket.emit('initialize:opponents', players);

  var player = {
    id: Guid.create().value
  };

  players[player.id] = player;
  socket.emit('initialize:player', player);
  socket.broadcast.emit('broadcast:entrance', player);

  socket.on('report:location', function(data) {
    //log(socket.request.socket.remoteAddress, 'report:location', data);
    data.id = player.id;
    players[player.id] = data;
    socket.broadcast.emit('broadcast:location', data);
  });

  var broadcastLaunch = function(data) {
    //log(socket.request.socket.remoteAddress, 'broadcast:launch', data);
    data.playerId = player.id;
    socket.broadcast.emit('broadcast:launch', data);
    socket.broadcast.emit('launch', data);
  }

  socket.on('report:launch', broadcastLaunch);
  socket.on('launch', broadcastLaunch);

  socket.on('disconnect', function() {
    //log(socket.request.socket.remoteAddress, 'disconnect', null);
    socket.broadcast.emit('broadcast:exit', player.id);
    delete players[player.id];
  });

});

module.exports = server;

