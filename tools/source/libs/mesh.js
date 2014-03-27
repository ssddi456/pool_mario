define([

],function(

){
  function mesh () {
    this.polys = [];  
  }
  var mfn = mesh.prototype;
  mfn.draw = function( ctx, trans ) {
    this.polys.forEach(function( poly ) {
      poly.draw ( ctx, trans );   
    });
  }

  mfn.addPoly = function() {
    var _p = new poly();
    _p.color = this.color;
    poly.apply( _p, arguments );
    this.polys.push( _p );
  }
  mfn.setColor = function( color ){
    this.color = color;
    this.polys.forEach(function(poly){
      poly.color = color;
    });
  }
  function poly ( point_a, point_b, point_c ) {
    this.points = [point_a, point_b, point_c];
  }
  var pfn = poly.prototype;
  pfn.draw = function( ctx, trans ) {
    ctx.beginPath();
    var ps = this.points.map(function( pt ) {
      return trans(pt);
    });
    ctx.moveTo( ps[0].x, ps[0].y );
    ctx.lineTo( ps[1].x, ps[1].y );
    ctx.lineTo( ps[2].x, ps[2].y );
    ctx.lineTo( ps[0].x, ps[0].y );
    var proto = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.strokeStyle = proto;
    ctx.closePath();
  }
  return mesh;
});