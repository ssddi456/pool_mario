define([

],function(

){
  var util = {
    nf      : function(){},
    inherit : function( sub, sup ){
      var sfn  = sub.prototype;
      var sufn = sup.prototype;
      for(var k in sufn){
        if(sufn.hasOwnProperty(k) && !(k in sfn)){
          sfn[k] = sufn[k];
        }
      }
      return sfn;
    },
    resolve_dependence : function( dep_chain, resolve_tree, ret ){
      ret = ret || [];
      if( typeof dep_chain == 'function' ){
        ret.push( dep_chain );
      } else if( typeof dep_chain == 'string' ){
        util.resolve_dependence(resolve_tree[dep_chain], resolve_tree, ret);
      } else if( Array.isArray( dep_chain ) ){
        dep_chain.forEach(function(dep){
          util.resolve_dependence(dep, resolve_tree, ret);
        });
      }
      return ret;
    },
    remove_from_array : function ( item, array ){
      array.splice( array.indexOf(item), 1 );
    },
    floor : function ( num ){
      var dir = num >= 0 ? 1 : -1;
      return dir * Math.floor( Math.abs(num) );
    }
  };
  return util;
});