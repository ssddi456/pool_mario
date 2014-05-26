define([
  './animates',
  './particals',
  './collider_data',
  '../e985521a4d6a9e378718bf60/output/stage',
  '../180230427271b73d72f05d66/output/stage',
  './collider_util',
  './stages/stage'
],function(
  animates,
  particals,
  collider_data,
  stage4_1,
  stage1_1,
  collider_util,
  stage
){
  ['../e985521a4d6a9e378718bf60/output/css.css',
  '../180230427271b73d72f05d66/output/css.css']
    .forEach(function( css ){
      $('<link rel="stylesheet" href="' + require.toUrl(css)+'" />').appendTo('head');
    });

  var $wrapper = $('.wrapper');
  var full = collider_util.getpos($wrapper);


  return {
    '1-1'     : stage1_1,
    '4-1'     : stage4_1,
    el        : $wrapper,
    cur_stage : undefined,
    get       : function( stage_id ) {
      var stage_info = stage_id.split('-');
      var tstage = stage_info.slice(0,2).join('-');
      var stage = this[tstage];
      var scene = stage[stage_info[2]] || stage['1'];

      if ( this.cur_stage != stage ){
        this.cur_stage = stage;
        // respawn scene
        $wrapper.html( stage.map ).css( stage.size );
        
        particals.killAll();
        animates.killAll();

        collider_data.init( tstage, stage.prefix );

      }

      scene.el = this.el;

      return scene;
    },
    get_stage : function( stage_id ){
      var stage_info = stage_id.split('-');
      var tstage = stage_info.slice(0,2).join('-');
      return this[tstage];
    }
  };
});