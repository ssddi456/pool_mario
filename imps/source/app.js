require.config({
  paths :{
    box2d      : [
      '/lib/box2d',
      '/static/js/lib/box2d'
    ],
    ko         : [
      '/lib/knockout-2.2.0',
      '/static/js/lib/knockout-2.2.0'
    ],
    jquery     : [
      '/lib/jquery-1.7.1',
      '/static/js/lib/jquery-1.7.1'
    ],
    underscore : [
      '/lib/underscore-min',
      '/static/js/lib/underscore-min'
    ],
    pixel      : [
      '/lib/canvas/pixel',
      '/static/js/lib/canvas/pixel'
    ]
  }
});

require([
  'jquery',
  './libs/mesh',
  './controls',
  './libs/vector',
  './world',
  './timer',
  'box2d'
],function(
  jquery,
  mesh,
  controls,
  vector,
  world_simulater,
  timer,
  _box2d
){
  var NUM = 2;

  var NUMRANGE = [];
  while (NUMRANGE.length < NUM) NUMRANGE.push(NUMRANGE.length+1);
  var bodies = [null]; // Indexes start from 1

  var ZERO = new Box2D.b2Vec2(0.0, 0.0);
  var temp = new Box2D.b2Vec2(0.0, 0.0);
  
  // Box2D-interfacing code

  var gravity = new Box2D.b2Vec2(0.0, -10.0);

  var world = new Box2D.b2World(gravity);

  var clistener = new Box2D.b2ContactListener();

  console.log( clistener );
  clistener.BeginContact = function(){ console.log(arguments); };
  clistener.EndContact = function(){ console.log(arguments); };
  clistener.PostSolve = function(){ console.log(arguments); };
  clistener.PreSolve = function(){ console.log(arguments); };
  world.SetContactListener( clistener );

  function boxClider (){
    
  }
  var bd_ground = new Box2D.b2BodyDef();
  var ground = world.CreateBody(bd_ground);

  var shape0 = new Box2D.b2EdgeShape();
  shape0.Set(new Box2D.b2Vec2(-40.0, -6.0), new Box2D.b2Vec2(40.0, -6.0));
  ground.CreateFixture(shape0, 0.0);
  ground.fixture = ground.GetFixtureList();

  var bd_fl = new Box2D.b2BodyDef();
  var fl    = world.CreateBody(bd_fl);
  var sh_fl = new Box2D.b2EdgeShape();
  sh_fl.Set(new Box2D.b2Vec2(-150,-150), new Box2D.b2Vec2(150,-150));
  fl.CreateFixture(sh_fl,0);
  fl.fixture = fl.GetFixtureList();

  var bg_layer = world_simulater.layers.addLayer('bg');
  
  var ms_bg = new mesh();
  ms_bg.addPoly(new vector(-40.0, -6.0), new vector(40.0, -6.0), new vector(0, -12))
  bg_layer.addItem( new vector( 0, 0), ms_bg );

  var ms_fl = new mesh();
  ms_fl.addPoly(new vector(-150,-150), new vector(150,-150), new vector(0, -150))
  bg_layer.addItem( new vector( 0, 0), ms_fl );

  var bd_control = new Box2D.b2BodyDef();
  bd_control.set_type(Box2D.b2_kinematicBody);
  bd_control.set_position(ZERO);

  var control = world.CreateBody(bd_control);
  var sh_control = new Box2D.b2PolygonShape();
  sh_control.SetAsBox(12,12);
  control.CreateFixture(sh_control,6);

  var ms_control = new mesh();
  ms_control.addPoly(new vector(-12,12),new vector( 12, 12), new vector( 12, -12) );
  ms_control.addPoly(new vector(-12,12),new vector(-12, -12), new vector( 12, -12) );
  var ctl_layer  = world_simulater.layers.addLayer('ctl');
  var it_control = ctl_layer.addItem(new vector(0,0), ms_control);

  control.fixture = control.GetFixtureList();
  control.writeTo = update_pos;
  control.item    = it_control;

  var size = 3.0;
  var shape = new Box2D.b2PolygonShape();
  shape.SetAsBox(size, size);

  var item_layer = world_simulater.layers.addLayer('item');

  NUMRANGE.forEach(function(i) {
    var bd = new Box2D.b2BodyDef();
    bd.set_type(Box2D.b2_dynamicBody);
    bd.set_position(ZERO);
    var body = world.CreateBody(bd);
    body.CreateFixture(shape, 5.0);
    body.writeTo = update_pos;
    bodies.push(body);
    body.item = item_layer.addItem(new vector(0,0));
  });

  function resetPositions() {
    NUMRANGE.forEach(function(i) {
      var body = bodies[i];
      temp.Set(25*(Math.random()-0.5), 2.0 + 1.5*i);
      body.SetTransform(temp, 0.0);
      body.SetLinearVelocity(ZERO);
      body.SetAwake(1);
      body.SetActive(1);
    });
  }

  resetPositions();

  function update_pos() {
    var bpos = this.GetPosition();
    this.item.pos.x = bpos.get_x();
    this.item.pos.y = bpos.get_y();
    this.item.angle = this.GetAngle();
  }

  var lastInactivity = Date.now();
  function someInactive() {
    var asleep = 0;
    for (var i = 0; i < NUM; i++) {
      if (!bodies[i+1].IsAwake()) {
        asleep++;
        if (asleep == 5) return true;
      }
    }
    return false;
  }

  // Main demo code

  var boxes = [];

  var position = [0,0,0];

  function simulate(dt) {
    world.Step(dt, 2, 2);

/*    var contact = world.GetContactList();
    var count   = world.GetContactCount();
    if( contact.GetFixtureA() === control.fixture ||
        contact.GetFixtureB() === control.fixture 
    ){
      console.log( 'control collusion');
    };
    for(var i=1;i<count;i++){
      contact = contact.GetNext();
      var fa = contact.GetFixtureA();
      var fb = contact.GetFixtureB();

    }
*/

    control.writeTo();
    // Read box2d data into JS objects
    for (var i = 0; i < NUM; i++) {
      bodies[i+1].writeTo();
    }
  }


  function restart() {
    console.log( '!!! restart !!!' );
    timer.pause();
    setTimeout(function(){
      resetPositions();
      timer.start();
    },1e3)
  }
  var i = 2;
  world_simulater.init('simulator');
  timer.mainLoop(function( time ){
    world_simulater.drawer.clean();
    simulate( time.delta );
    // !(--i) && timer.pause(); 
    world_simulater.drawer.draw();
  });


  var LEFT  = new Box2D.b2Vec2(-1, 0); 
  var RIGHT = new Box2D.b2Vec2( 1, 0);
  var UP    = new Box2D.b2Vec2( 0, 1);
  var DOWN  = new Box2D.b2Vec2( 0,-1);
  var TEMP_V= new Box2D.b2Vec2(0,0);
  controls
    .on('tap',  'a',function() {
        console.log('tap on a !!');
    })
    .on('dbtap','a',function() {
        console.log('dbtap on a !!');
    })
    .on('chargeStart','a',function() {
        console.log('charge on a !!');
    })
    .on('chargeEnd','a',function() {
        console.log('charge end a !!');
    });
  [
    ['a',LEFT, RIGHT],
    ['d',RIGHT, LEFT],
    ['w',UP,    DOWN],
    ['s',DOWN,    UP]
  ].forEach(function( keymap ){
    controls
      .on('down',keymap[0],function(){
        TEMP_V.op_add(keymap[1]);
        console.log( keymap[0], TEMP_V.get_x(), TEMP_V.get_y() );
        control.SetLinearVelocity(TEMP_V);
      })
      .on('up',keymap[0],function(){
        TEMP_V.op_add(keymap[2]);
        console.log( keymap[0], TEMP_V.get_x(), TEMP_V.get_y() );
        control.SetLinearVelocity(TEMP_V);
      })
  })

  timer.start();
});