define([
  './item'

],function(
  item

){
  var layers = {};
  var names  = [];

  function Layer ( name, items ) {
    this.name  = name;
  }
  var lfn = Layer.prototype;
  lfn.addItem = function( pos, mesh ) {
    var ret = new item ( pos, mesh )
    layers[this.name].push( ret );
    return ret;
  };

  layers.walk     = function( handle ) {
    var layeri = 0, layern = names.length, layer;
    var itemi  = 0, itemn;
    for( ;layeri < layern; layeri ++){
      layer = layers[names[layeri]];
      for( itemi = 0, itemn = layer.length; itemi < itemn; itemi ++ ){
        handle( layer[itemi] );
      }
    } 
  };
  layers.addLayer = function( name ) {
    names.push( name );
    layers[name] = [];
    return new Layer( name );
  };
  layers.getLayer = function( name ) {
    if( layers.hasOwnProperty(name)){
      return new Layer(name);
    }
  };
  return layers;
});