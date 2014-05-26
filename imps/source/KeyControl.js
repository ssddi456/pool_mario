define([
  './libs/emitter',
  'underscore'
],function(
  emitter,
  __
){
  var CHARGE_SENSITIVE = 200;
  var DOUBLE_TAP_SENSITIVE = 600;
  function KeyControl ( keycode ) {
    this.keycode  = keycode;
    this.keydown  = 0;
    this.charging = false;
    this.last_tap = 0;
    this.last_act = 0;
    emitter.call(this);
  }
  var kcfn = KeyControl.prototype;
  $.extend(kcfn,emitter.prototype);
  kcfn.down = function( time ) {
    if( !this.keydown ){
      this.emit('down', this);
      this.keydown = time;
      return;
    }
    if( time - this.keydown >= CHARGE_SENSITIVE && !this.charging ){
      this.charging = true;
      this.emit( 'chargeStart', this );
    }
  };
  kcfn.up   = function( time ) {
    this.emit ( 'up', this );
    if( this.keydown ){
      if( time-this.keydown >= CHARGE_SENSITIVE ){
        this.emit( 'chargeEnd', this );
        this.charging = false;
      } else if( time - this.keydown < CHARGE_SENSITIVE ){
        if( !this.last_tap ){
          this.emit('tap', this);
          this.last_tap = time;
        } else if( time - this.last_tap <= DOUBLE_TAP_SENSITIVE ){
          this.emit('dbtap', this );
          this.last_tap = 0;
        } else {
          this.emit('tap', this);
          this.last_tap = time;
        }
      }
      this.keydown = 0;
    }
  }
  return KeyControl
});