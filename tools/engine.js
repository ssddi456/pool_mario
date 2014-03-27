define([
  './env'
],function(
  env
){
  'use strict';

  function Engine ( options ) {
    options = options || {};

    this.dspeed     = options.dspeed     || 96;
    this.maxspeed   = options.maxspeed   || 128;
    this.max_energy = options.max_energy || 72;
    
    this.t_speed   = { x : 0, y : -1 * this.maxspeed };
    this.t_energy  = 0;
    this.status    = 'falling'; // falling can stand
                                //         can attack
                                // stand   can jump
                                //         can fall
                                // jumping can not jump
                                //         can break blocks
                                //         can fall

  }
  var fn = Engine.prototype;
  fn.acc            = function( dir) {
    if( this.status == 'squating' ){
      return;
    }
    this.t_speed.x += dir * this.dspeed;
    this.normalizeSpeed();
  };

  Engine.dcc            = function( cur, max ) {
    if( cur !== 0 ){
      var abs = Math.abs(cur);
      var dir = cur > 0 ? 1 : -1;
      var dcc = 0.2 * max;
      if( dcc >= abs ){
        return 0;
      } else {
        return dir * ( abs - dcc );
      }
    }
    return cur;
  };
  Engine.normalize  = function( cur, max ) {
    var abs = Math.abs(cur);
    var dir = abs/cur;
    if( abs > max ){
      return max * dir;
    }
    return cur;
  }
  fn.normalizeSpeed = function(){ 

    this.t_speed.x = Engine.normalize( this.t_speed.x, this.maxspeed );
    this.t_speed.y = Engine.normalize( this.t_speed.y, this.maxspeed );

  };
  fn.statusMap = {
    stand : function( status){
      switch ( status ){
        case 'jumping' :
          this.t_energy = this.max_energy;
          this.t_speed.y= this.maxspeed;
          this.status = status;
          return;
        case 'falling' :
          this.t_energy = 0;
          this.t_speed.y = -1*this.maxspeed;
          this.status = status;
          return;
        case 'squating':
          if( Math.abs(this.t_speed.x) < 0.1 * this.maxspeed ){
            this.t_speed.y = 0;
            this.t_speed.x = 0;
            this.status = status;
          }
          return;
      }
    },
    squating:function( status ){
      switch( status ){
        case 'stand' :
          this.t_speed.y = -1 * this.maxspeed;
          this.status = status;
          return;
      }
    },
    falling :function( status ){
      switch ( status ){
        case 'stand':
          this.t_energy = 0;
          this.t_speed.y = -1*this.maxspeed;
          this.status = status;
          return;
      }
    },
    jumping : function( status ){
      switch ( status ){
        case 'falling' :
          this.t_energy = 0;
          this.t_speed.y = -1*this.maxspeed;
          this.status = status;
          return;
      }
    }
  };
  fn.setStatus      = function( status ) {
    var prestatus = this.status;
    this.statusMap[ this.status ].call(this,status);
    if( prestatus === this.status ){
      return;
    }
    if( this.animateMap ){
      this.animateMap[prestatus].reset(this);
      this.animateMap[this.status].start(this);
    }
  };
  fn.getSpeed = function() {
    return this.t_speed;
  };
  fn.updateSpeed = function() {
  };
  fn.updateAnimate = function(){
  };
  fn.loseEnergy = function( move ) {
    if( this.status == 'jumping' ){
      this.t_energy -= -1 * move.top;
      if( this.t_energy <= 0 ){
        this.setStatus( 'falling' );
      }
    } else if( this.status == 'stand' && move.top > 0 ){
      this.setStatus('falling');
    }
    // after status change finish then update animate status
    this.updateAnimate();
  };
  return Engine;
});