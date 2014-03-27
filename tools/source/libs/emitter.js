define([

],function(

){
  function Emitter () {
    var events = {};
    this.getEvents = function( type ) {
      if( events.hasOwnProperty(type) ){
        return events[type];
      } else {
        events [ type ] = $.Callbacks();
        return events[type]
      }
    };
  }
  var efn = Emitter.prototype;
  efn.on  = function( type, handle ) {
    var e = this.getEvents(type);
    e && e.add(handle);
    return this;
  };
  efn.emit = function( type ) {
    var e = this.getEvents(type);
    e && e.fire.apply(e, _.toArray ( arguments ).slice(1) );
    return this;
  };
  efn.once = function( type, handle ) {
    var e = this.getEvents(type);
    if( e ){
      var _handler = function() {
        handle.apply(this,arguments);
        e.remove(_handler);
      }
      e.add(_handler);
    }
    return this;
  };
  efn.remove = function( type, handle) {
    this.getEvents(type)[handle?'remove':'empty'](handle)
  }
  return Emitter
});