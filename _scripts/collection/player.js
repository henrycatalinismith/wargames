import Backbone from 'backbone';
import Player from '../model/player';

const Players = Backbone.Collection.extend({
  model: Player
});

export default Players;
