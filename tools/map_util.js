var script_map = {};
function load_script ( src, done ) {
  if( src in script_map ){
    return done();
  }
  var script = document.createElement('script');
  script.onload = function(){
    script_map[src] = 1;
    done();
  };
  script.src = src;
  document.head.appendChild(script);
  return false;
}

function load_scripts ( srcs, done ){
  if( !Array.isArray(srcs) ){
    return load_script(srcs, done);
  } 
  var count = srcs.length;
  var curr  = 0;
  function fin(){
    curr ++;
    if(curr >= count){
      return done();
    }
  }
  for(var i = 0;i < count; i++){
    load_script(srcs[i],fin);
  }
}


load_scripts([
  'http://cdn.staticfile.org/jquery/2.0.3/jquery.js',
  'http://cdn.staticfile.org/underscore.js/1.5.2/underscore-min.js',
  'http://cdn.staticfile.org/require.js/2.1.10/require.js'
],function(){

  require.config({
    baseUrl : '../../imps',
    paths : {
      jquery : 'http://cdn.staticfile.org/jquery/2.0.3/jquery',
      'es5-shim' : 'http://cdn.staticfile.org/es5-shim/2.3.0/es5-shim'
    },
    deps : [/*'click_to_parse_name',*/'shadow_walker']
  });
});
