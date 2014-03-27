define([
  './collider_data',
  './util',
  './logger_panal',
  './collider_util',
  './collider'
],function(
  collider_data,
  util,
  logger_panal,
  collider_util,
  collider
){

  return function update ( wanderer, delta_t ){
    wanderer.updateSpeed();

    $.extend(wanderer.prepos,wanderer.pos);
    
    var now     = wanderer.prepos;
    var premove = wanderer.pos;
    

    var speed   = wanderer.getSpeed();
    var sdelta  = { top  : util.floor(-1 * speed.y * delta_t.sec_delta),
                    left : util.floor(     speed.x * delta_t.sec_delta)};

    var delta   = $.extend({},sdelta);

    premove.left += delta.left;
    premove.top  += delta.top;

    if( wanderer.is_mario ){
      // nb collider may shift to blocking collider, so test first
      var ncollusion = collider.collide(wanderer.pos,collider_data.ncolliders);
      logger_panal('ncolliders', ncollusion);
      if( ncollusion.length ){
        collider.resolve_collusion(wanderer, collider_util.get_solids(ncollusion), collider_data.ncolliders );
      }
    }

    var precollusions = collider.collide(premove);
    logger_panal('precollusions len', precollusions.length);
    if ( !precollusions.length ){
      logger_panal('precolliders '   , []);
    } else {
      var precolliders  = collider_util.get_solids(precollusions)
                            .sort(function( collider_a, collider_b ) {
                              // sort for better collusion test
                              var dx, dy;
                              if( delta.top > 0 ){
                                dy = collider_a.top - collider_b.top;
                              } else {
                                dy = collider_b.top - collider_a.top;
                              }
                              if( dy !== 0 ){
                                return dy;
                              }
                              if( delta.left > 0 ){
                                dx = collider_a.left - collider_b.left;
                              } else {
                                dx = collider_b.left - collider_a.left;
                              }
                              return dx;
                            });

      var colliders_to_resolve = [];
      logger_panal('delta',            delta);
      logger_panal('precolliders '   , precolliders);
      precolliders.forEach(function( solid, i ) {
        
        if( i !== 0 ){
          var adjust_collide = collider.collide_check( premove, [solid]);
          if( !adjust_collide[0].collided ){
            return;
          }
        }
        colliders_to_resolve.push(solid);
        // collusion adjust
        var cur_collide_test = collider.collide_check( now, [solid])[0];

        var intersection = collider_util.boxintersection( premove, solid, delta );
        
        logger_panal('intersection '+i,intersection);
        
        if ( !cur_collide_test.x ){
          delta.left = delta.left  -  intersection.x;
        } else if ( !cur_collide_test.y ){
          delta.top  = delta.top   -  intersection.y;
        }
        
        premove.top  = now.top  + delta.top;
        premove.left = now.left + delta.left;
        
      });

      var fcollusion = {
        top : sdelta.top - delta.top,
        left: sdelta.left- delta.left
      };
      collider.resolve_collusion ( wanderer, colliders_to_resolve, collider_data.gcolliders );
      wanderer.onCollusion(fcollusion, delta);
    }

    logger_panal('pos',premove);

    if( now.left == premove.left && now.top == premove.top ){
      return;
    }


    wanderer.loseEnergy( delta );
    wanderer.move();

  };
});