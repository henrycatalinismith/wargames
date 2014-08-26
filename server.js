var server = require('http').Server();
var Guid = require('guid');
var io = require('socket.io')(server);
var _ = require('underscore');

var players = {};

io.on('connection', function(socket){

  var player = {
    id: Guid.create().value
  };

  players[player.id] = player;

  _.values(players)
    .filter(function(player) { return typeof player.latitude !== 'undefined'; })
    .map(function(player) { socket.emit('player:located', player); });

  socket.on('player:located', function(data) {
    data.id = player.id;
    players[player.id] = data;
    socket.emit('player:located', data);
    socket.broadcast.emit('player:located', data);
  });

  socket.on('launch', function(data) {
    data.playerId = player.id;
    socket.broadcast.emit('launch', data);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('player:left', player.id);
    delete players[player.id];
  });

});
server.listen(3000);
