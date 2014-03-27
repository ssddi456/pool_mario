define([
  './util'
],function(
  util
){
  var collider_triggers = {
    resolve_trigger : function( trigger, args ){
      trigger = util.resolve_dependence(trigger, collider_triggers);
      var e = args[0];
      e.triggers = this;
      var _t;
      for(var i = 0, len = trigger.length; i < len; i += 1 ){
        _t = trigger[i];
        if( _t.apply(null,args) !== true){
          return;
        }
      }
    },
    addTriggers : function( trigger_name, trigger ) {
      if( typeof trigger_name == 'object' ){
        for( var k in trigger_name ){
          this.addTriggers(k, trigger_name[k]);
        }
        return;
      }
      !this[trigger_name] &&( this[trigger_name] = trigger);
    }
  };
  return collider_triggers;
});