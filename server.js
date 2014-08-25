var server = require('http').Server();
var io = require('socket.io')(server);
io.on('connection', function(socket){

  socket.on('launch', function(data) {
    socket.broadcast.emit('launch', data);
  });

  socket.on('disconnect', function() {
  });

});
server.listen(3000);
