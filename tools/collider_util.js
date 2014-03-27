define([

],function(

){

  function getpos ( item){
    return {
      top    : item.css('top'   ).replace('px','')*1 || 0,
      left   : item.css('left'  ).replace('px','')*1 || 0,
      height : item.css('height').replace('px','')*1 || 0,
      width  : item.css('width' ).replace('px','')*1 || 0
    };
  }
  function line ( start, len ){
    var ret = [start, start+len];
    ret._len = len;
    return ret;
  }
  function boxcollide ( pos1, pos2 ){
    var x_collid = linercollide( 
            line( pos1.left, pos1.width ),
            line( pos2.left, pos2.width ));
    var y_collid = linercollide( 
            line( pos1.top, pos1.height ),
            line( pos2.top, pos2.height ));
    return {
      x       : x_collid,      
      y       : y_collid,
      collided: x_collid && y_collid,
      origin  : pos1,
      solid   : pos2
    };
  }
  function linercollide ( line1, line2 ){
    var x1 = Math.min.apply(null, [].concat(line1,line2));
    var x2 = Math.max.apply(null, [].concat(line1,line2));
    return x2 - x1 < line1._len + line2._len;
  }
  function lineintersection( origin, solid, direction ){
    if( direction > 0 ){ 
      return origin[1] - solid[0];
    } else {
      return origin[0] - solid[1];
    }
  }
  function boxintersection ( origin, solid, direction ) {
    return {
      x : lineintersection( 
            line( origin.left, origin.width ), 
            line( solid.left,  solid.width ),
            direction.left ),
      y : lineintersection(
            line( origin.top, origin.height ),
            line( solid.top,  solid.height ),
            direction.top )
    };
  }
  function get_solid ( collusion ){
    return collusion.solid;
  }
  function get_solids ( collusions ){ 
    return collusions.map(get_solid);
  }
  function containboxcollide ( inner, outer ){
    var inner_v = line(inner.top,inner.height);
    var inner_h = line(inner.left,inner.width);
    var b_top = linercollide(
              inner_v,
              line(outer.top-inner.height,inner.height));
    var b_bot = linercollide(
              inner_v,
              line(outer.top+outer.height,inner.height));
    var b_lft = linercollide(
              inner_h,
              line(outer.left-inner.width,inner.width));
    var b_rht = linercollide(
              inner_h,
              line(outer.left+outer.width,inner.width));
    return {
      top    : b_top,
      bottom : b_bot,
      left   : b_lft,
      right  : b_rht
    };
  }
  return {
    getpos           : getpos,
    get_solids       : get_solids,
    line             : line,
    boxcollide       : boxcollide,
    linercollide     : linercollide,
    lineintersection : lineintersection,
    boxintersection  : boxintersection,
    containboxcollide: containboxcollide
  };
});