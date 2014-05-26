define([
  './libs/typedmap',
  './KeyControl',
  'underscore'
],function(
  typedmap,
  KeyControl,
  __
){
  var controls = {};
  var keymaps  = new typedmap( KeyControl );

  var traces   = [];



  $(document)
    .on('keydown',function(e) {
      keymaps.getKey(e.keyCode).down(e.timeStamp);
    })
    .on('keyup',function(e) {
      var ctl = keymaps.get(e.keyCode);
      ctl && ctl.up(e.timeStamp);
    })
  $(window)
    .on('blur', _.debounce(function(e) {
      console.log('window blur', e.timeStamp );
    }))
    .on('focus',_.debounce(function(e) {
      console.log('window focus', e.timeStamp);
    }));

  // type 
  //   tap 
  //   double tap
  //   chargeStart
  //   chargeEnd
  controls.on = function( type, key, handle ) {
    keymaps.getKey((key+'').toUpperCase().charCodeAt(0)).on(type,handle);
    return this;
  }
  return controls
});