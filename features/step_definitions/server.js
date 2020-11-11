const expect = require('expect');
const ioClient = require('socket.io-client');

module.exports = function() {
  const players = [];

  const server = require('../../src/server');
  server.listen(8080);

  const connect = n => {
    players[n] = ioClient('http://127.0.0.1:8080', {
      forceNew: true
    });

    const addSpy = name => {
      players[n][name] = expect.createSpy();
      players[n].on(name, () => players[n][name]());
    }

    [
      'broadcast:entrance',
      'broadcast:launch',
      'broadcast:location'
    ].map(addSpy);

    return players[n];
  }

  this.After(() => {
    for (var n in players) {
      players[n].close();
      delete players[n];
    }
  });

  this.Given(/^player (\d+) is connected$/, (n, done) => {
    connect(n).on('connect', () => done());
  });

  this.When(/^player (\d+) connects$/, (n, done) => {
    connect(n).on('connect', () => done());
  });

  this.Given(/^player (\d+) reports their location$/, (n, done) => {
    players[n].emit('report:location', {
      latitude: 0,
      longitude: 0
    });
    setTimeout(done, 100);
  });

  this.Then(/^player (\d+) receives a ([^ ]+) event$/, (n, event, done) => {
    expect(players[n][event]).toHaveBeenCalled();
    done();
  });

  this.Given(/^player (\d+) reports a launch$/, (n, done) => {
    players[n].emit('report:launch', { origin: [0, 0] });
    setTimeout(done, 100);
  });

};
