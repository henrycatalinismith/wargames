define(['mocha', 'sinon', 'gtw/model/missile'], function(mocha, sinon, Missile) {

  describe('model/missile', function(){

    var missile;

    before(function () {
      missile = new Missile;
    });

    describe('#launch', function() {
      it('launches missiles that are ready', function() {
        missile.set({ status: 'ready' });
        missile.launch();
        missile.get('status').should.equal('flight');
      });

      it('dispatches a launch event', function() {
        var spy = sinon.spy();
        missile.set({ status: 'ready' });
        missile.on('launch', spy);
        missile.launch();
        spy.calledOnce.should.be.true;
      });

      it('fails when launching non-ready missiles', function() {
        missile.set({ status: 'detonated' });
        (function () {
          missile.launch();
        }).should.throw('Cannot launch missiles that are not ready');
      });
    });

    describe('#detonate', function() {
      it('detonates missiles in flight', function() {
        missile.set({ status: 'flight' });
        missile.detonate();
        missile.get('status').should.equal('detonated');
      });

      it('refuses to detonate missiles that are not in flight', function() {
        missile.set({ status: 'ready' });
        (function () {
          missile.detonate();
        }).should.throw('Cannot detonate missiles that are not in flight');
      });
    });

  });
});
