import Backbone from 'backbone';
import Missile from '../model/missile';

const Missiles = Backbone.Collection.extend({
  model: Missile
});

export default Missiles;
