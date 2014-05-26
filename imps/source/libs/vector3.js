define([

],function(

){
    function Vector (x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  var fn = Vector.prototype;

  fn.add = function( vec ) {
    if( vec.x || vec.x === 0 ){
      this.x += vec.x;
      this.y += vec.y;
      this.z += vec.z;
    } else {
      this.x += vec;
      this.y += vec;
      this.z += vec;
    }
    return this;
  };
  fn.multi = function( vec ) {
    if( vec.x || vec.x === 0 ){
      return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    } else {
      this.x *= vec;
      this.y *= vec;
      this.z *= vec;
      return this;
    }
  }
  fn.cross = function( vec ) {
    return new Vector(this.y * vec.z - vec.y * this.z ,  this.z * vec.x -this.x * vec.z, this.x * vec.y-vec.x  * this.y );
  };

  
  return  Vector;
});