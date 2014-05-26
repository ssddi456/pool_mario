define([
  './util',
  './mario_dead'
],function(
  util,
  mario_dead
){
  function mushroom_dead () {
    mario_dead.apply( this, arguments );
  }
  var fn  = util.inherit( mushroom_dead, mario_dead);
  fn.grow = util.nf;
  fn.die  = function() {
    this.el.remove();  
  };
  return mushroom_dead;
});