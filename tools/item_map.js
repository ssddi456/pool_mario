define([

],function(

){
  
                        

  var container     = $('<div></div>').appendTo('body');
  var build_info    = $('<pre></pre>').appendTo('body');
  var collider_info    = $('<pre></pre>').appendTo('body');
  var item_template = _.template(
    '<div>'+
    'type : <%=type%> '+
    'pos : <%=pos%> '+
      '<button class="remove">remove</button>'+
      '<select class="spirit_type">'+
        ['','exclude','exclude_compose','replace'].map(function( type ){
          return'<option value="'+ type +'">'+ type +'</option> ';
        }).join('')+
      '</select>'+
      '<select class="collider_group">'+
        ['gcolliders','ncolliders'].map(function( type ){
          return'<option value="'+ type +'">'+ type +'</option> ';
        }).join('')+
      '</select>'+
      '<select class="collider_type">'+
        ['','coiner','multi_coiner','spawner','replacable','destroyable'].map(function( type ){
          return'<option value="'+ type +'">'+ type +'</option> ';
        }).join('')+
      '</select>'+
    '</div> ');

  var item_map     = _.template(
    ['"exclude":(',
    '  <%=exclude.join(",\\n  ")%>',
    '),',
    '"exclude_compose":(',
    '  <%=exclude_compose.join(",\\n  ")%>',
    '),',
    '"replace":{',
    '  <%=replace.join(",\\  n")%>',
    '},'].join('\n'));


  var collider_map = _.template([
    'gcolliders : [',
    '  <%=gcolliders.join(",\\n  ")%>',
    '],',
    'ncolliders : [',
    '  <%=ncolliders.join(",\\n  ")%>',
    ']'].join('\n'));
  function get_item_data ( self ) {
    var data = self.data();
    data.spirit_type    = self.find('.spirit_type').val();
    data.collider_group = self.find('.collider_group').val();
    data.collider_type  = self.find('.collider_type').val();
    return data;
  }
  function get_all_item_data (){
    return  [].map.call(container.children(),function( div ) {
              return get_item_data($(div));
            });
  }
  function remove_item(){
    var $self = $(this);
    $self.parent('div').remove();
    change_binding();
  }
  var rPos = /chips_([^\.]*)\./;
  function class_to_compose( classname ){
    return classname.match(rPos)[1];
  }
  function change_binding () {
    var datas = get_all_item_data();
    datas = _.uniq(datas,function( data ){
      return data.type;
    });
    var collider_datas = _.extend({
      'gcolliders':[],
      'ncolliders':[]
    },_.groupBy( datas, 'collider_group'));
    _.each(collider_datas,function( list ) {
      _list = list.map(function( item, i ){
        if( item.collider_type == '' ){
          return'"' + class_to_compose(item.type) + '"';
        } else {
          return'["' + class_to_compose(item.type) + '","'+ item.collider_type +'"]';
        }
      });
      _list = _.uniq(_list);
      list.length = _list.length;
      _list.forEach(function( item, i ){
        list[i] = item;
      });
      console.log( _list );
    });
    console.log( collider_datas );
    collider_info.html(collider_map(collider_datas));

    var spirit_datas = _.extend({
      'exclude' : [],
      'exclude_compose' : [],
      'replace' : []
    },_.groupBy( datas, 'spirit_type'));
    _.each(spirit_datas,function( list ) {
      _list = list.map(function( item, i ){
        return'"' + class_to_compose(item.type) + '"';
      });
      _list = _.uniq(_list);
      list.length = _list.length;
      _list.forEach(function( item, i ){
        list[i] = item;
      });
    });

    build_info.html(item_map(spirit_datas));
    
  }

  container.on('click', '.remove', remove_item);
  container.on('change','select',  change_binding)
  return {
    addItem : function( item ){
      if( !_.find(get_all_item_data(),function( nitem ){
            return item.type == nitem.type;
          })
      ){
        container.append( $(item_template(item)).data(item) );
        change_binding();
      }
    }
  };
});