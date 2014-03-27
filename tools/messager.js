define([
  'jquery'
],function(
  $
){
  var messager = $('<div></div>');
  return {
    on   : function() {
      messager.on.apply( messager, arguments );
    },
    emit : function() {
      messager.trigger.apply( messager, arguments);
    }
  };
});