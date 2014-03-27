define([
  '../mushroom',
  '../spawnee'
],function(
  mushroom,
  spawnee
){
   
  var mushroom_spawnee = spawnee.bind(null,mushroom);
  var double_spawnee   = spawnee.bind(null,function( pos ) {
     return [new mushroom(pos),
             new mushroom($.extend({}, pos, { left : pos.left + 24 }))
            ].map(function( mush ) {
              mush.t_speed.x = -1 * mush.maxspeed;
              return mush;
            });
  }); 
  var fourfold_spawnee   = spawnee.bind(null,function( pos ) {
     return [new mushroom(pos),
             new mushroom($.extend({}, pos, { left : pos.left + 24 })),
             new mushroom($.extend({}, pos, { left : pos.left + 24 + 40 })),
             new mushroom($.extend({}, pos, { left : pos.left + 24 + 40 + 24 }))
            ];
  });


  return {
    gcolliders :  [
                    '0-200',
                    ['1504-136', 'multi_coiner'],
                    ['1616-136', 'star_spawner'],
                    '2144-184',
                    ['256-136', 'coiner' ],
                    ['320-136', 'destroyable'],
                    ['336-136', 'spawner' ],
                    '3392-200',
                    '3392-24' ,
                    '3600-168',
                    '3600-184',
                    '3616-168',
                    '3616-184',
                    '3632-168',
                    '3632-184',
                    '3632-24' ,
                    '448-168' ,
                    '448-184' ,
                    '464-168' ,
                    '464-184' 
                  ],
    ncolliders : [
                  ['1024-120', 'bspawner'],
                  ['3456-104', 'coin'],
                  ['3168-56',  'flag_pole'],
                  {
                    top    : 128,
                    left   : 742,
                    width  : 8,
                    height : 8,

                    type   : 'subway_entrance'
                  },{
                    top    : 184,
                    left   : 3592,
                    width  : 8,
                    height : 8,

                    type   : 'subway_exit'
                  },{
                    top   : 184,
                    left  : 3272,
                    height: 32,
                    width : 8,

                    type  : 'stage_fin'
                  },{
                    top    : 120,
                    left   : 911,
                    height : 16,
                    width  : 16,

                    type   : 'save_point'
                  },{
                    top   : 152,
                    left  : 2616,
                    height: 16,
                    width : 16,

                    type   : 'save_point'
                  }
                ],
    init        : function() {
      this.ccolliders = [
                          { "left": 352,  "top": 184, "height": 16,  "width": 16}, 
                          
                          { "left": 640,  "top": 184, "height": 16,  "width": 16}
                        ].map(function( pos ) {
                          return new mushroom_spawnee(pos);
                        }).concat([ 
                          { "left": 816,  "top": 184, "height": 16,  "width": 16}, 
                          // { "left": 840,  "top": 184, "height": 16,  "width": 16},

                          { "left": 1281, "top": 56,  "height": 16,  "width": 16}, 
                          // { "left": 1312, "top": 56,  "height": 16,  "width": 16}, 
                          
                          { "left": 1554, "top": 184, "height": 16,  "width": 16}, 
                          // { "left": 1578, "top": 184, "height": 16,  "width": 16}, 
                          
                          { "left": 1826, "top": 184, "height": 16,  "width": 16}, 
                          // { "left": 1850, "top": 184, "height": 16,  "width": 16}, 
                          
                          { "left": 2784, "top": 184, "height": 16,  "width": 16}
                          // { "left": 2808, "top": 184, "height": 16,  "width": 16}
                        
                        ].map(function( pos ) {
                          return new double_spawnee(pos);
                        }))
                        .concat([
                          { "left": 1985, "top": 184, "height": 16,  "width": 16}
                          // { "left": 2008, "top": 184, "height": 16,  "width": 16}, 
                          // { "left": 2048, "top": 184, "height": 16,  "width": 16}
                          // { "left": 2072, "top": 184, "height": 16,  "width": 16}, 
                          
                        ].map(function(pos) {
                           return new fourfold_spawnee(pos);
                        }))
        
    }
  };

   

});