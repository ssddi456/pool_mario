define([
  './messager',
  './star',
  './stages',
  './camera',
  './collider_data',
  './collider_util',
  './coin',
  './wanderer'
],function(
  messager,
  star,
  stages,
  camera,
  collider_data,
  collider_util,
  coin,
  wanderer
){
  return {
    mario       : function( e, mario ){
      if( mario.is_mario ){
        return true;
      }
    },
    not_immortal: function( e, mario ){
      if( !mario.immortal ){
        return true;
      }
    },
    gore        : function( e, mario, collider ){
      if( mario.status == 'jumping' ){
        if( mario.pos.top >= collider.top + collider.height ){
          return true;
        }
      }
    },
    stamp       : function( e, mario, collider ) {
      if( mario.status == 'falling' ){
        var pre_collusion = collider_util.boxcollide(mario.prepos,collider.pos);
        if( !pre_collusion.y ){
          return true;
        }
      }
    },
    ngore       : function( e, mario, collider ){
      if( mario.status == 'jumping' ){
        var btm = collider.top + collider.height;
        var pre_collusion = collider_util.boxcollide(mario.prepos,collider);
        if( mario.pos.top <= btm && pre_collusion.x && !pre_collusion.y ){
          return true;
        }
      }
    },
    squat       : function( e, mario ){
      if( mario.status == 'squating' ){
        return true;
      }
    },
    move_left   : function( e, mario ){
      if( mario.status == 'stand' && mario.t_speed.x > 0 ){
        return true;
      }
    },

    destroyable : [ 'mario', 'gore',
                    function( e, mario, collider ) {
                      collider.$el.remove();
                      collider.destroyed = true;
                      e.stopped = true;
                    }],
    replacable :  [ 'mario', 'gore', 
                    function ( e, mario, collider ) {
                      collider.$el.attr('class','block d_block');
                      // remove triggers
                      collider.type = undefined;
                      e.stopped = true;
                    }],
    coin       :  [ 'mario',
                    function(e, mario, collider){
                      collider.$el.attr('class','block').css('background','black');
                      
                      collider.destroyed = true;

                    }],
    coinb       :  [ 'mario',
                    function(e, mario, collider){
                      collider.$el.remove();
                      collider.destroyed = true;
                    }],
    coiner     :  [ 'mario', 'gore', 
                    function ( e, mario, collider ) {
                      collider.$el.attr('class','block d_block');
                      // remove triggers
                      collider.type = undefined;
                      e.stopped = true;
                      var $coin = $('<div class="coin block"></div>').appendTo('.wrapper').css(collider);
                      coin.create($coin);
                    }],
    multi_coiner : [ 'mario', 'gore', 
                      function ( e, mario, collider ) {
                        if( collider.coins == 1 ){
                          // remove triggers
                          collider.$el.attr('class','block d_block');
                          collider.type = undefined;
                          e.stopped = true;
                        } else if ( collider.coins === undefined ){
                          collider.coins = 9;
                        } else {
                          collider.coins -=1;
                        }
                        var $coin = $('<div class="coin block"></div>').appendTo('.wrapper').css(collider);
                        coin.create($coin);
                      }],
    spawner    : [ 'mario', 'gore', 
                    function( e, mario, collider ) {
                      
                      var mushroom = wanderer.create( $.extend({}, collider, {
                                                        top : collider.top - collider.height 
                                                      }) );
                      mushroom.type = 'lvupper';
                      collider.$el.attr('class','block d_block');
                      collider.type = undefined;
                      e.stopped = true;
                    }],
    bspawner   : [ 'mario', 'ngore', 
                    function( e, mario, collider ) {
                      var mushroom = wanderer.create( $.extend({}, collider, {
                                                        top : collider.top - collider.height 
                                                      }));
                      mushroom.type = 'lvupper';

                      collider.$el.attr('class','block d_block');
                      // set this as blocking collider;
                      util.remove_from_array( collider, collider_data.ncolliders);
                      collider_data.gcolliders.push( collider );

                      collider.type = undefined;
                      e.stopped = true;
                    }],
    star_spawner   : [ 'mario', 'ngore', 
                      function( e, mario, collider ) {

                        var $star = $('<div class="star block"></div>').appendTo('.wrapper');
                        $star.css({
                          top : collider.top - collider.height,
                          left: collider.left
                        });

                        var _star = new star( $star );
                        _star.status = 'stand';
                        _star.t_speed.x = _star.maxspeed;
                        _star.setStatus('jumping');

                        collider.$el.remove();
                        collider.destroyed = true;

                        e.stopped = true;
                      }],
    mushroom        : ['mario',function(e, mario, collider) {
                        if( e.triggers['stamp'].apply(null, arguments) ){
                          collider.die();
                          mario.status = 'stand';
                          mario.t_speed.x = 0;
                          mario.setStatus('jumping');
                          mario.t_energy = 32;
                        } else if( e.triggers['not_immortal'].apply(null, arguments) ){
                          mario.lvup(-1);
                        }
                      }],
    subway_entrance : ['mario','squat',function(e, mario){
                        mario.pos.top  = 0;
                        mario.pos.left = 3424;
                        camera.change_scene( stages.get('1-1-2') );
                      }],
    subway_exit     : ['mario','move_left',function(e, mario){
                        mario.pos.top  = 168 - mario.pos.height;
                        mario.pos.left = 2872;
                        camera.change_scene( stages.get('1-1-1') );
                      }],
    lvupper         : ['mario',function(e, mario, collider){
                        mario.lvup();
                        collider.die();
                      }],
    lvdowner        : ['mario',function(e, mario){
                        mario.lvup(-1);
                      }],
    save_point      : ['mario',function(e, mario, collider ){
                        messager.emit('update_save_point', { pos : collider });
                      }],
    flag_pole       : ['mario',function(e, mario, collider){
                        // var _up = mario.updateSpeed;
                        mario.updateSpeed = wanderer.prototype.updateSpeed;
                        mario.onCollusion = wanderer.prototype.onCollusion;

                        mario.pos.left = collider.left + Math.ceil(collider.width/2);
                        mario.t_speed.x = 0;

                      }],
    stage_fin       : ['mario',function(e,mario,collider){
                        mario.t_speed.x = 0;
                        mario.t_speed.y = 0;
                        mario.el.hide();
                        collider.destroyed = true;
                        alert('Congratulations !!!');
                        messager.emit('change_stage',{stage : '4-1-1'});
                      }]
  };
});