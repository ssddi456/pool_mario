define([
  './util',
  './partical'
],function(
  util,
  partical
){
  function mario_immortal ( mario ) {
    partical.call(this);
    this.target = mario;
    mario.immortal = true;
  };
  var fn = util.inherit( mario_immortal, partical );
  fn.die = function() {
    this.target.immortal = false;
  };
  fn.destroy = fn.die;
  return mario_immortal;
});