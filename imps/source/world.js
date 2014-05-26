define([
  './layers',
  './libs/vector',
  'pixel',
  'underscore'
],function(
  layers,
  vector,
  pixel,
  __
){
  var drawer = {};
  drawer.clean = function() {
    drawer.canvas.clean()
  }
  drawer.draw = function() {
    drawer.tempcanvas.clean();
    layers.walk(function( item ) {
      if( item.mesh ){
        item.mesh.draw(drawer.tempcanvas.ctx, _.compose( drawer.worldtocanvas, item.objtoworld.bind(item)) );
      } else {
        var pos  = drawer.worldtocanvas( item.pos );
        drawer.tempcanvas.ctx.strokeRect( pos.x - 1.5, pos.y - 1.5, 3, 3 );
      }
    });
    drawer.tempcanvas.drawTo(drawer.canvas.canvas);
  };


  var world  = {};
  world.size = new vector(300,300);
  world.setSize = function( x, y) {
    vector.apply( world.size, arguments );
    drawer.worldscale = new vector(  
                          drawer.tempcanvas.width  / world.size.x, 
                          drawer.tempcanvas.height / world.size.y );
  };

  world.addLayer = function( layername ) {
    layernames.push(layername);
    layers[layername] = [];
  }
  world.init = function( canvas ) {
    if( canvas.nodeName && canvas.nodeName == 'CANVAS' ){

    } else {
       canvas = document.getElementById(canvas);
    }

    drawer.tempcanvas    = new pixel.Canvas( canvas.width, canvas.height );
    drawer.canvas        = new pixel.Canvas( canvas );
    var canvascenter     = new vector( canvas.width/2, canvas.height/2 );
    drawer.worldscale    = new vector( canvas.width/world.size.x, canvas.height/world.size.y);
    drawer.worldtocanvas = function( VecW ) {
      var VecC = new vector( VecW.x * drawer.worldscale.x , -1 * VecW.y * drawer.worldscale.y );
      VecC.add( canvascenter );
      return VecC;
    }
  };

  world.layers = layers;
  world.drawer = drawer;

  return world;
});