define([
  './source/timer'
],function(
  timer
){
  var debug = true;

  var enables = ['mushroom pos'];

  var panel = $('<div class="logger_panel"></div>').appendTo('body');
  var timeout = 3000;
  var datas = {};

  function log ( key ){
    this.key  = key;
    this.$el  = $('<p class="log">' + key + ' : <span class="val"></span></p>').appendTo(panel);
    this.$val = this.$el.find('.val');
    this.last_update = Date.now();
  }
  log.prototype.update = function ( val ){
    try{
      this.$val.text(JSON.stringify(val,null,4));
    } catch(e){
      this.$val.text(e.message);
    }
    this.last_update = Date.now();
  };
  log.prototype.timeout = function() {
    this.$el.remove();
  };
  function logger ( key, val ) {
    if( enables.indexOf(key) == -1 ){
      return;
    }
    if( !datas[key] ){
      datas[key] = new log(key);
    }
    datas[key].update(val);
  }

  function clear_up () {
    var now = Date.now();
    for(var k in datas ){
      if( datas[k] && (datas[k].last_update + timeout) < now ){
        datas[k].timeout();
        datas[k]= undefined;
      }
    }
  }

  timer.mainLoop(clear_up);
  if(debug){
    return logger;
  } else{
    return function() {};
  }
});