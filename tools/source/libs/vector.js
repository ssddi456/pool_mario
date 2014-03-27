define([

],function(

){
  function Vector (x,y) {
    this.x = x;
    this.y = y
  }
  var fn = Vector.prototype;

  fn.add = function( vec ) {
    if( vec.x || vec.x === 0){
      this.x += vec.x;
      this.y += vec.y;
    } else {
      this.x += vec;
      this.y += vec;
    }
    return this;
  };
  fn.multi = function( vec ) {
    if( vec.x || vec.x === 0 ){
      return this.x * vec.x + this.y * vec.y;
    } else {
      this.x += vec;
      this.y += vec;
      return this;
    }
  };

  return  Vector;

});