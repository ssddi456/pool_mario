define([
  './logger_panal',
  './wanderer',
  './util'
],function(
  logger_panal,
  wanderer,
  util
){
  function star () {
    wanderer.apply(this,arguments);
    this.maxspeed   = 64;
    this.max_energy = 120;
  }
  util.inherit(star,wanderer);
  var fn = star.prototype;
  fn.onCollusion = function( collusions, delta ) {
    logger_panal('s collusions', collusions);
    logger_panal('s delta', delta);

    if ( collusions.top !== 0 ){
      if( this.status == 'jumping' ){
        this.setStatus('falling');
      } else if( this.status == 'falling' ){
        this.setStatus('stand');
        this.setStatus('jumping');
      }
    } 
    if( delta.left === 0 && delta.top === 0 && this.t_speed.x !== 0){
      // if cant move try falling
      this.t_speed.x = 0;
    } else {
      if ( collusions.left < 0 ){
        this.t_speed.x = this.maxspeed;
      } else if ( collusions.left > 0 ){
        this.t_speed.x = -1 * this.maxspeed;
      } else if ( this.t_speed.x === 0 ){
        this.t_speed.x = -1 * this.maxspeed;
      }
    }
  };
  star.create = function ( $el ){
    return new star($el);
  };
  return star;
});