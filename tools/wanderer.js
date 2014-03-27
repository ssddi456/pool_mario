define([
  './logger_panal',
  './util',
  './collider_util',
  './engine',
  './animates'
],function(
  logger_panal,
  util,
  collider_util,
  engine,
  animates
){
  function wanderer ( el ) {
    engine.call(this);
    this.el  = el;
    this.pos = collider_util.getpos(el);
    this.prepos=$.extend({},this.pos);
    animates.push(this);
  }
  util.inherit( wanderer,engine);
  var fn = wanderer.prototype;

  fn.move        = function() {
    if( this.pos.top > 224 ){
      this.die();
    } else{
      this.el.css(this.pos);
    }
  };
  fn.onCollusion = function( collusions, delta ) {
    logger_panal('w collusions', collusions);
    logger_panal('w delta', delta);

    if ( collusions.top !== 0 ){
      if( this.status == 'jumping' ){
        this.setStatus('falling');
      } else if( this.status == 'falling' ){
        this.setStatus('stand');
      }
    } 

    if ( collusions.left < 0 ){
      this.t_speed.x = this.maxspeed;
    } else if ( collusions.left > 0 ){
      this.t_speed.x = -1 * this.maxspeed;
    } else if ( this.t_speed.x === 0 ){
      this.t_speed.x = this.maxspeed;
    }

  };

  fn.die  = function() {
    this.dead = true;
    this.el.remove();
  };
  wanderer.create = function( pos, el ){
    if( !el ){
      el = $('<div class="mushroom block"></div>').appendTo('.wrapper');
    }
    el.css({
      top : pos.top,
      left: pos.left
    });
    var mushroom = new wanderer( el );
    mushroom.t_speed.x = mushroom.maxspeed;
    return mushroom;
  };
  return wanderer;
});