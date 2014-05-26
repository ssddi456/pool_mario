define([
  './collider_data',
  './logger_panal',
  './stages',
  './collider_util'
],function(
  collider_data,
  logger_panal,
  stages,
  collider_util
){
  var $camera = $('.camera');
  
  return {
    force : function( tar ){
      if( this.target === tar ){
        return;
      }
      this.target = tar;
      this.update();
    },
    change_scene : function( scene ){
      if( this.scene === scene ){
        return;
      }
      this.scene = scene;
      this.update();
    },
    camera: $camera,
    pos   : collider_util.getpos($camera),
    prepos: undefined,
    target: undefined,
    scene : undefined,
    update: function(){
      if ( this.prepos ){
        $.extend(this.prepos,this.pos);
      }

      this.pos.left= Math.floor(this.target.pos.left - this.pos.width/2);
      var collusion = collider_util.containboxcollide(this.pos,this.scene);
      if( collusion.left ){
        this.pos.left = this.scene.left;
      } else if (collusion.right ){
        this.pos.left = this.scene.width - this.pos.width;
      }
      stages.el.css({left:-1*this.pos.left});

      this.camera_active();

      if( !this.prepos ){
        this.prepos= $.extend({},this.pos);
      }
    },
    camera_active : function() {
      var pos    = this.pos;
      var prepos = this.prepos;
      collider_data.ccolliders
        .forEach(function( ccollider ) {
          var cur_collided = collider_util.boxcollide( pos, ccollider.pos ).collided;
          if( cur_collided){
            if( prepos ){
              if( !collider_util.boxcollide( prepos, ccollider.pos ).collided ){
                ccollider.onCollusion();
              }
            } else {
              ccollider.onCollusion();
            }
          }
        });
    }
  };
});