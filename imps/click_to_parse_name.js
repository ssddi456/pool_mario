require([
  './collider_util',
  './item_map'
],function(
  collider_util,
  item_map
){
  
  
  
  function hoverSelectContent(){
    this.setSelectionRange(0,this.value.length);
  }

  var $pos  = $('<p><span>pos      </span>:<input class="info"></input></p>').appendTo('body').find('.info')
                .click( hoverSelectContent );
  var $pos_t = $('<p><span>pos      </span>:<input class="info"></input></p>').appendTo('body').find('.info')
                .click( hoverSelectContent );
  var $info = $('<p><span>chip_path</span>:<input class="info"></input></p>').appendTo('body').find('.info')
                .click( hoverSelectContent );
  
  var t_pos = _.template('[<%=left%>, <%=top%>, <%=left+width%>, <%=top+height%>]');
  var t_pos_t= _.template('(<%=left%>, <%=top%>, <%=left+width%>, <%=top+height%>)');

  $('.block').click(function(){
    var $self= $(this);
    var chip_path = $self.css('backgroundImage').match(/([^\/]{24}\/.*)\)$/)[1];
    var o_pos = collider_util.getpos($self);
    var pos   = t_pos(o_pos);
    var pos_t = t_pos_t(o_pos);

    $pos.val(pos);
    $pos_t.val(pos_t);
    $info.val(chip_path);

    item_map.addItem({pos:pos, type:'i' + chip_path.replace(/\//g,'_')});
  });
});

