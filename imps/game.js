define([
  './animates',
  './datas/s1_1',
  './datas/s4_1',
  './collider_data',
  './collider_triggers_ex',
  './collider_triggers',
  './messager',
  './main_loop',
  './camera',
  './mario',
  './stages'
],function(
  animates,
  s1_1,
  s4_1,
  collider_data,
  collider_triggers_ex,
  collider_triggers,
  messager,
  main_loop,
  camera,
  mario,
  stages
){

  var game = {};
  game.lastSavePoint = {
    stage : undefined,
    pos   : $.extend({},mario.pos)
  };
  game.currentStage = {

  };
  game.respawn = function() {
    camera.target = mario;
    camera.scene  = stages.get(this.lastSavePoint.stage);
    camera.update();

    mario.respawn();
    $.extend(mario.pos,this.lastSavePoint.pos);

    if( !main_loop.isplaying ){
      main_loop.start();
    }
  };
  
  // events
  messager.on('update_save_point',function( e, data ) {
    if( data.stage ){
      game.lastSavePoint.stage = data.stage;
    }
    if( data.pos   ){
      $.extend(game.lastSavePoint.pos, data.pos);
    }
  });
  messager.on('change_stage', function( e, data ) {
    if( data.stage ){
      game.lastSavePoint.stage = data.stage;
      game.lastSavePoint.pos = $.extend({},mario.pos,stages.get_stage(data.stage).start_point);

      game.respawn();
    }
  });
  messager.on('respawn', function( e, data ) {
    game.respawn();
  });

  // setup datas
  animates.push(mario);

  collider_triggers.addTriggers( collider_triggers_ex );

  collider_data.setStages({
    '1-1' : s1_1,
    '4-1' : s4_1
  });


  return game;
});