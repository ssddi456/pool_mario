define([
  './mario_immortal',
  './animate_frames',
  './mario_dead',
  './keybroad',
  './logger_panal',
  './collider_util',
  './engine'
],function(
  mario_immortal,
  animate_frames,
  mario_dead,
  keybroad,
  logger_panal,
  collider_util,
  engine
){


  var mario = new engine();
  mario.is_mario = true;
  mario.onCollusion = function( collusions ) {
    logger_panal('collusion',collusions);
    if ( collusions.top !== 0 ){
      if( this.status == 'jumping' ){
        this.setStatus('falling');
      } else if( this.status == 'falling' ){
        this.setStatus('stand');
      }
    } 
    if ( collusions.left !== 0 ){
      this.t_speed.x = 0;
    }
  };
  mario._onCollusion = mario.onCollusion;
  mario.lv = 1;
  mario.maxlv=2;
  mario.initLv = function(){
    this.lv = 1;
    this.max_energy = 56 + 16;
    this.el
      .addClass('lv1')
      .removeClass('lv2')
      .removeClass('lv0');
    this.pos.height = 16;
  };
  // mario.getSpeed =  function(){
  //   return {
  //     x : this.t_speed.x,
  //     y : 0
  //   }
  // }
  mario.lvup = function( dir ){
    dir = dir || 1;
    // nomarlize lv
    var prelv = this.lv;
    this.lv += 1 * dir;
    if( this.lv > this.maxlv ){
      this.lv = this.maxlv;
    }
    if( prelv == this.lv ){
      return;
    }
  // update status    
    this.el.removeClass('lv' + prelv );
    this.el.addClass('lv' + this.lv);
    this.max_energy = 56 + this.lv * 16;
   
    if( this.lv == this.maxlv ){
      this.pos.top   -= 16;
      this.pos.height = 32;
    } else{
      if( this.lv == 0 ){
        this.die();
        return;
      }
      if( dir < 0 ){
        new mario_immortal( this );
      }
      if ( prelv == this.maxlv ){
        this.pos.top   += 16;
        this.pos.height = 16;
      }
    }
    this.move();
  };
  var dim = $('<div class="block player"></div>').appendTo('.wrapper');
  mario.el  = dim;
  mario.pos = collider_util.getpos(dim);
  mario.prepos = $.extend({},mario.pos);
  mario.move= function() {
    if( this.pos.top > 224 ){
      return this.die();
    }
    this.el.css(this.pos);
  };
  mario.verticalSpeedStat = function( x_speed ) {
    if( x_speed === 0 ){
      return 'stand';
    } else if ( Math.abs( x_speed ) < 0.6 * this.maxspeed ){
      return 'walk';
    } else {
      return 'walk';
    }
  };
  mario.updateAnimate = function( pre_speed_x ){
    var status = this.status;
    var x_speed = this.t_speed.x;
    if( status == 'stand' ){
      var pre_state = this.verticalSpeedStat( pre_speed_x );
      status = this.verticalSpeedStat( x_speed );
      if( pre_state != status ){
        this.animateMap[pre_state].reset(this);
        this.animateMap[status].start(this);
      }
      this.animateMap[status].update(this);
    } else {
      this.animateMap['walk'].playing && this.animateMap['walk'].reset(this);
      this.animateMap['run'].playing && this.animateMap['run'].reset(this);
    }
    if( pre_speed_x <= 0 && x_speed > 0 ){ 
      this.el.removeClass('reverse');
    } else if ( pre_speed_x >= 0 && x_speed < 0 ){
      this.el.addClass('reverse');
    }
    this.animateMap[status].update(this);
  };
  mario.animateMap = {
    stand    : new animate_frames( 'stand',    1,  1, true  ),
    walk     : new animate_frames( 'walk',     4,  8, true  ),
    run      : new animate_frames( 'run',      20, 1, true  ),
    squating : new animate_frames( 'squat',    20, 1, false ),
    jumping  : new animate_frames( 'jump',     1,  1, false ),
    falling  : new animate_frames( 'fall',     1,  1, true  )
  };
  mario.updateSpeed = function() { 
    var pow = 1;
    var cur_speed_x = this.t_speed.x;

    if( this.status =='jumping'){
      pow = 0.5;
    }
    if( keybroad.haspressed('w') && this.status == 'stand'){
      this.setStatus('jumping');
    }
    if( keybroad.haspressed('a') ){
      this.acc(-1 * pow );
    }
    if( keybroad.hasholding('s') ){
      this.setStatus('squating');
    } else if( this.status == 'squating' ){
      this.setStatus('stand');
    }
    if( keybroad.haspressed('d') ){
      this.acc(1 * pow );
    }


    if( this.t_speed.x !== 0 ){
      var x = this.t_speed.x;
      var delta = (this.status == 'stand' ? 0.2 : 0.05) * this.maxspeed;
      var abs = Math.abs(x);
      var dir = x > 0 ? 1 : -1;
      if( delta >= abs ){
        this.t_speed.x = 0;
      } else {
        this.t_speed.x = dir * ( abs - delta);
      }
    }
    this.updateAnimate( cur_speed_x );
  };
  mario._updateSpeed = mario.updateSpeed;
  mario.die = function(){
    this.initLv();
    this.dead = true;
    dim.addClass('dead');
    return new mario_dead(dim);
  };
  mario.respawn = function(){
    this.dead = false;
    this.move();
    
    this.updateSpeed = this._updateSpeed;
    this.onCollusion = this._onCollusion;

    dim.removeClass('dead');
    dim.appendTo('.wrapper').show();
  };
  mario.animateMap['falling'].start( mario );
  return mario;
});