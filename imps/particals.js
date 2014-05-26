define([

],function(

){
  var particals= [];
  particals.check_living = function() {
    for(var i = this.length - 1; i>=0; i-=1){
      if( this[i].life <= 0  ){
        this[i].die();
        this.splice(i,1);
      }
    }
  };
  particals.grow = function() {
    for(var i = this.length-1;i>=0;i-=1){
      this[i].life -= 1;
      this[i].grow();
    }
  };
  particals.killAll = function() {
    for(var i = this.length - 1; i>=0; i-=1){
      this[i].destroy();
    }
    this.length = 0;
  };
  return particals;
});