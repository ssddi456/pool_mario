define([

],function(

){
  function spawnee ( spawner, pos  ) {
    this.pos = pos;
    this.spawner_c = spawner;
    this.spawn = [];
  }
  var fn = spawnee.prototype;
  fn.onCollusion = function() {
    if( !this.spawn.length || !this.hasLivingSpawn() ){
      this.spawn.length = 0;
      var spawns = new this.spawner_c( this.pos );
      if( Array.isArray( spawns ) ){
        this.spawn = spawns;
      } else {
        this.spawn = [spawns];
      }
    }
  };
  fn.hasLivingSpawn = function(){
    return this.spawn.some(function(spawn){
      return !spawn.dead;
    });
  };
  fn.reset = function() {
    this.spawn.forEach(function( spawn ){
      spawn.dead = true;
    });
    this.spawn.length = 0;
  };

  return spawnee;
});