define([
  './util',
  './wanderer'
],function(
  util,
  wanderer
){
  function jumping_star (){
    wanderer.call(this);
  }
  util.inherit(jumping_star,wanderer);
  var fn = jumping_star.prototype;
  fn.onCollusion = function( collusions ){

  };
  return jumping_star;
});