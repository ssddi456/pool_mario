define([
  './libs/vector'

],function(
  vector

){
  function Item ( pos, mesh ) {
    this.pos = pos;
    this.mesh= mesh;
  }
  var fn = Item.prototype;
  fn.objtoworld = function( point ) {
    return new vector(0,0).add(this.pos).add(point);
  }
  return Item;  
});