define([
  'jquery'
],function(
  jquery
){
  var scence = {
    loop     : $.Callbacks('memory'),
    mainLoop : function( handle ) {
      this.loop.add(handle);
    }
  };

  var internal  = (1e3/24)|0;
  var startTime = new Date().getTime();
  var timer     = {
    now  : startTime,
    past : 0,
    delta: 0,
    prev : startTime,
    start: startTime
  };

  var timeridx;
  function loopfun () {
    timer.now  += internal;//new Date().getTime();
    timer.past = timer.now - timer.start;
    timer.delta= timer.now - timer.prev;
    // ready for update
    scence.loop.fire({
       now   : timer.now,
       past  : timer.past,
       delta : timer.delta,
       sec_delta: timer.delta/1000,
       prev  : timer.prev,
       start : timer.start
    });
    scence.draw && scence.draw();
    // next call
    timer.prev = timer.now;
    timeridx   = setTimeout( loopfun, internal); 
  }
  
  scence.start = function() {
    timer.now   =
    timer.prev  =
    timer.start = new Date().getTime();
    this.isplaying = true;
    loopfun();
  };
  scence.pause = function() {
    var self = this;
    setTimeout(function() {
      self.isplaying = false;
      clearTimeout( timeridx );
    });
  };
  return scence;
});