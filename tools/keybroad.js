define([
  'jquery'
],function(
  $
){
  var hold_keys = {};

  function keyToStr( code ) {
    switch(code){
      case 1:   
      case 38:   
      case 269:   
        return 'up';   
      case 40:   
      case 2:   
      case 270:   
        return 'down'
      case 37:   
      case 3:   
      case 271:    
        return 'left';
      case 39:   
      case 4:   
      case 272: 
        return 'right';
      default :
        return String.fromCharCode(code).toLowerCase();
    }
  }

  var key_down_control = function(e) {
    var chr = keyToStr(e.keyCode);
    hold_keys[chr] = true;
  };
  var key_up_control = function(e) {
    var chr = keyToStr(e.keyCode);
    hold_keys[chr] = false;
  };

  $(document)
    .on('keydown', key_down_control )
    .on('keyup', key_up_control );
  return {
    haspressed : function( key ) {
      if( hold_keys[key] === true ){
        return true;
      }else if( hold_keys[key] === false ){
        hold_keys[key]=undefined;
        return true;
      }
      return false;
    },
    hasholding:function(key){
      if( hold_keys[key] === true ){
        return true;
      }
      return false;
    }
  };
});