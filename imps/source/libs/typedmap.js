define([

],function(

){
  function TypedMap ( type ) {
    var map = {};
    this.getKey = function( key ) {
      if( map.hasOwnProperty (key) ){
        return map[key]
      }
      return map[key] = new type(key);
    }
    this.get   = function( key ) {
      if( map.hasOwnProperty (key) ){
        return map[key]
      } 
    }
  }
  return TypedMap
});