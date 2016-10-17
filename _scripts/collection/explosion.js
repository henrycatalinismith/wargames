import Backbone from 'backbone';
import Explosion from '../model/explosion';

const Explosions = Backbone.Collection.extend({
  model: Explosion
});

export default Explosions;
