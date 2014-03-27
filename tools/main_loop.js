define([
  './collider',
  './camera',
  './particals',
  './logger_panal',
  './animates',
  './mover',
  './source/timer'
],function(
  collider,
  camera,
  particals,
  logger_panal,
  animates,
  mover,
  timer
){

  timer.mainLoop(function( delta_t ) {
    animates.forEach(function( wanderer ){
      if( !wanderer.dead ){
        mover( wanderer, delta_t );
      }
    });

    collider.mario_collide( animates );
    animates.check_living();

    logger_panal('wanderers', animates.length);

    particals.grow();
    particals.check_living();

    camera.update();
  });
  camera.camera.click(function(){
    if( timer.isplaying ){
      timer.pause();
    } else {
      timer.start();
    }
  })
  return timer;
});