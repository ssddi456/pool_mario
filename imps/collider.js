define([
  './collider_data',
  './collider_triggers',
  './collider_util'
],function(
  collider_data,
  collider_triggers,
  collider_util
){
  
  function resolve_collusion ( mario, collideds, collider_group ) {
    var e = {
      stopped : false
    };
    var toDestroy = [];
    for(var i = 0,len =collideds.length;i<len;i+=1){
      var collider = collideds[i];
      if(collider.type){
        collider_triggers.resolve_trigger( collider.type, [e, mario,collider] );
        if( collider.destroyed ){
          toDestroy.push(collider_group.indexOf(collider));
        }
        if( e.stopped ){
          break;
        }
      }
    }
    toDestroy.reverse().forEach(function(idx){
      collider_group.splice(idx,1);
    });
  }

  return {
    collide : function( pos, colliders ){
      return this.collide_check ( pos, colliders )
                .filter(function( collusion ) {
                  return collusion.collided;
                });
    },
    collide_check:function( pos, colliders ) {
      return (colliders || collider_data.gcolliders)
                .map(function( solid ){
                  return collider_util.boxcollide(pos,solid);
                });  
    },
    mario_collide:function( animates ){
      if( animates.length < 2){
        return;
      }
      var mario = animates[0];
      var self  = this;
      if( mario.dead ){
        return;
      }
      animates.forEach(function( wanderer, i ){
        if( i !== 0 ){
          var wcollusion = self.collide(mario.pos,[wanderer.pos]);
          if( wcollusion.length ){
            self.resolve_collusion(mario, [wanderer], animates );
          }
        }
      });
    },
    resolve_collusion:resolve_collusion
  };
});