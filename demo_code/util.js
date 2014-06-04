$(function() {
  var $logger = {
    add : function( id ) {
      $logger[$logger.stat].append('<div>' + id + '</div>');
    }
  };
  ['remove','replace'].forEach(function( key, idx ) {
    $logger[key] = $('<div style="float:left;width:200px;margin-top:200px;"><h3 style="text-align:center;">'+ key +'</h3></div>')
                      .appendTo('body')
                        .on('click','h3',function() {

                          $logger.stat = key;
                          $logger[key]
                            .css('background','yellow')
                            .siblings()
                            .css('background','white');

                        }).on('click', 'div',function() {
                          $(this).remove();
                        });

  });


  $('.wrapper').on('click','.block',function( e ) {
    $logger.add(this.className.split('_').pop());
  });

  $('<style>.block:hover{outline:1px solid black;z-index:1;}</style>').appendTo('head');
});