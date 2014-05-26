define([
  './messager',
  './collider_util',
  './util',
  './partical'
],function(
  messager,
  collider_util,
  util,
  partical
){
  function mario_dead ( el ) {
    partical.apply(this,arguments);
    this.el = $(el);
    this.pos = collider_util.getpos(this.el);
    this.life= 40;
  }
  var fn = util.inherit(mario_dead,partical);
  fn.grow = function(){
    if( this.life > 30 ){ // firsr 10 pause
      
    } else if( this.life > 20 ){ // last 20 frames
      this.pos.top -= 6;
    } else {
      this.pos.top += 6; // 10 frame up
    }
    this.el.css(this.pos);
  };
  fn.die = function(){
    this.el.hide();
    messager.emit('respawn');
  };
  return mario_dead;
});