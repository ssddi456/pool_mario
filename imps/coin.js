define([
  './collider_util',
  './util',
  './partical'
],function(
  collider_util,
  util,
  partical
){
  function coin ( el ) {
    partical.apply(this,arguments);
    this.el = $(el);
    this.pos = collider_util.getpos(this.el);
    this.life= 10;
  }
  util.inherit(coin,partical);
  var fn = coin.prototype;
  fn.grow = function(){
    this.pos.top -= 3;
    this.el.css(this.pos);
  };
  fn.die = function(){
    this.el.remove();
  };
  fn.destroy = fn.die;
  coin.create = function ( $el ){
    return new coin($el);
  };
  return coin;
});