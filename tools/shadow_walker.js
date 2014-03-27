define([
  './menu',
  './game'
],function(
  menu,
  game
){

  game.lastSavePoint.stage = '1-1-1';
  game.respawn();

});