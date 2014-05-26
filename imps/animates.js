define([
],function(
){
  var animates = [];
  animates.check_living = function() {
    for(var i = this.length - 1; i >= 1; i -= 1 ){
      if( this[i].dead ){
        this.splice(i,1);
      }
    }
  };
  animates.killAll = function() {
    this.length = 1;
  }

  return animates;                 
});