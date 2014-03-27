define([
  './collider_util'
],function(
  collider_util
){
  function cJson () {
    return {
      top    : this.top,
      left   : this.left,
      height : this.height,
      width  : this.width
    };
  }
  /*
    collider : 
      top
      left 
      height
      width

      $el
      cls
      type
   */
  function getColliderPos ( poses, prefix ) {
    // prefix just for reduce data size
    prefix = prefix || '';

    return [].reduce
              .call(poses,function( pre, cur ){
                if( typeof cur != 'string' && cur.type && cur.top != undefined ){
                  pre.push(cur);
                  return pre;
                }
                if( Array.isArray(cur) ){
                  var type = cur[1];
                  cur = cur[0];
                }
                var selector = prefix + cur;
                var _cur = [].map.call($(selector),function(el) {
                  var $el = $(el);
                  var collider = collider_util.getpos($el);
                  collider.$el = $el;
                  collider.cls = cur;
                  if(type){
                    collider.type = type;
                  }
                  collider.toJSON= cJson;
                  return collider;
                });
                return pre.concat(_cur);
              },[]);
  }
 
                // camare colliders -
 
  var stages = {};

//   init        : switch stages
//   
//   setStages   : add stages
//   
//   getColliderPos : get el bbox with ccs selector
//   
//   gcolliders  : blocking colliders
//   
//   ncolliders  : non blocking colliders
//                 only work when collider is mario
//   
//   ccolliders  : for camera use
  return {
    init  : function( stage, prefix ) {
      this.gcolliders = getColliderPos( stages[stage].gcolliders, prefix );
      this.ncolliders = getColliderPos( stages[stage].ncolliders, prefix );
      stages[stage].init.call( this );
    },
    setStages : function( stage_id, stage ) {
      if( typeof stage_id == 'object' ){
        for( var k in stage_id ){
          this.setStages(k, stage_id[k]);
        }
        return;
      }
      !stages [stage_id] && (stages[stage_id] = stage);
    },
    getColliderPos : getColliderPos
  }
});