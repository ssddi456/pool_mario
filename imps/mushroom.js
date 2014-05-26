define([
  './mushroom_dead',
  './logger_panal',
  './animate_frames',
  './util',
  './wanderer'
],function(
  mushroom_dead,
  logger_panal,
  animate_frames,
  util,
  wanderer
){
  function mushroom ( pos ) {
    var el   = $('<div class="mushroom block"></div>').appendTo('.wrapper');
    el.css(pos);
    wanderer.call(this, el);
    this.type = 'mushroom';
    this.maxspeed = 32;
    this.t_speed.x = this.maxspeed;

    var stand   = new animate_frames('walk', 1, 1, false);
    var walk    = new animate_frames('walk', 2, 8, true );
    var falling = new animate_frames('fall', 1, 1, false);
    var dead    = new animate_frames('dead', 2, 1, false);
    this.animateMap = {
      stand    : stand,
      walk     : walk,
      falling  : falling,
      dead     : dead 
    };
  }
  util.inherit(mushroom,wanderer);
  var fn = mushroom.prototype;
  var statusMap = fn.statusMap = $.extend({},fn.statusMap);
  statusMap.jumping = function( status ){
    switch ( status ){
      case 'falling' :
        this.t_energy = 0;
        this.t_speed.y = -4 * this.maxspeed;
        this.status = status;
        return;
    }
  };
  statusMap.stand = function( status){
    switch ( status ){
      case 'falling' :
        this.t_energy = 0;
        this.t_speed.y = -4 * this.maxspeed;
        this.status = status;
        return;
    }
  };
  fn.updateAnimate = function () {
    if( this.status == 'stand' ){
      if( Math.abs(this.t_speed.x) > 0 ){
        if( !this.animateMap.walk.playing ){
          this.animateMap.stand.reset(this);
          this.animateMap.walk.start(this);
        }
        this.animateMap.walk.update(this);
      } else {
        if( !this.animateMap.stand.playing ){
          this.animateMap.walk.reset(this);
          this.animateMap.stand.start(this);
        }
        this.animateMap.stand.update(this);
      }
    } else if ( this.animateMap.walk.playing ){
       this.animateMap['walk'].reset(this);
    } 
  };
  fn.die = function(){
    this.dead = true;
    this.el.addClass('dead');
    new mushroom_dead(this.el);
  }
  mushroom.create = function( pos ) {
    return new mushroom( pos );
  }
  return mushroom;
});