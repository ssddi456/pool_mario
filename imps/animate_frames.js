define([
  
],function(

){
  function animate_frames( cls, frames, frame_rate, loop ){
    this.cls = cls;
    this.frames = frames;
    this.frame_rate = frame_rate || 1;
    this.loop = loop || false;
    this.cur_tick = 0;
    this.max_tick = frames * this.frame_rate;
    this.cur_frame = 1;
    this.playing = false;
  }
  var fn = animate_frames.prototype;
  fn.update = function( tar ){
    if( this.cur_tick >= this.max_tick ){
      if( !this.loop ){
        return;
      } else {
        tar.el.removeClass( this.cls+this.cur_frame );
        this.cur_tick  = 0;
        this.cur_frame = 1;
        tar.el.addClass   ( this.cls+this.cur_frame );
      }
    }
    var p_frame = this.cur_tick / this.frame_rate;
    if( p_frame >= this.cur_frame ){
      this.cur_frame += 1;
      tar.el.removeClass(this.cls+(this.cur_frame-1))
            .addClass(this.cls+this.cur_frame);
    } 
    this.cur_tick += 1;
  };
  fn.reset  = function( tar ){
    this.playing = false;
    tar.el.removeClass(this.cls);
    tar.el.removeClass(this.cls+this.cur_frame);
    this.cur_tick = 0;
    this.cur_frame= 1;
  };
  fn.start = function(tar){
    this.playing = true;
    tar.el.addClass(this.cls).addClass(this.cls+this.cur_frame);
  };
  return animate_frames;
});