import compact
import os

def same_point ( p1, p2 ):
  return p1[0] == p2[0] and p1[1] == p2[1]

def pos_to_box ( pos ):
  '''
    pos [x, y, x1, y1]
  '''
  return (
          (pos[0],pos[1]), (pos[2],pos[1]),

          (pos[0],pos[3]), (pos[2],pos[3])
          )
def box_to_pos ( box ):
  return ( box[0][0], box[0][1], box[3][0], box[3][1] )

def connect_box_x ( box1, box2 ):
  if same_point(box1[1], box2[0]) and same_point(box1[3], box2[2]):
    return (box1[0],box2[1],box1[2],box2[3])
  return False

def connect_box_y ( box1, box2 ):
  if same_point(box1[2], box2[0]) and same_point(box1[3], box2[1]):
    return (box1[0],box1[1],box2[2],box2[3])
  return False

def sort_by_y_then_x(pos):
  return (pos[1],pos[0])

def sort_by_x_then_y(pos):
  return (pos[0],pos[1])

def compact_poses ( poses ):
  x_compacts = []
  poses = sorted(poses, key=sort_by_y_then_x)
  cur = pos_to_box(poses[0])
  for pos in poses[1:] :
    _box = pos_to_box(pos)
    _cur = connect_box_x( cur, _box )
    if not _cur :
      x_compacts.append( box_to_pos(cur) )
      cur = _box
    else :
      cur = _cur

  x_compacts.append( box_to_pos(cur) )

  y_compacts = []
  x_compacts = sorted(x_compacts, key=sort_by_x_then_y)
  cur = pos_to_box(x_compacts[0])
  for pos in x_compacts[1:] :
    _box = pos_to_box(pos)
    _cur = connect_box_y( cur, _box )
    if not _cur :
      y_compacts.append( box_to_pos(cur) )
      cur = _box
    else :
      cur = _cur
  
  y_compacts.append( box_to_pos(cur) )

  return y_compacts

def spirit_to_map ( spirits, hashes, chips ):
  spirits_map = {}
  for spirit in spirits :
    spirit_name, spirit = spirit
    spirit_replaced_chips = []
    for chip in spirit :
      hash = compact.md5_img( compact.open_as_rgb(chip))
      spirit_replaced_chips += hashes[hash]

    poses = []
    for chip in spirit_replaced_chips :
      basename = os.path.basename(chip)
      name, ext= os.path.splitext(basename)
      poses.append( chips["pos"][name] )

    spirits_map[spirit_name] = poses
  return spirits_map

def spirit_map_to_html ( chips, spirit_map, out_folder, optimizer ) :

  html_f = open ( out_folder + '/html.html', 'w+' )
  css_f  = open ( out_folder + '/css.css',   'w+' )

  if optimizer['custom_headers'] :
    for css in optimizer['custom_headers']['css']:
      html_f.write('<link rel="stylesheet" href="'+ css +'" />')
    for js in optimizer['custom_headers']['js']:
      html_f.write('<script src="'+ js +'" ></script>')
    
  html_f.write('<link rel="stylesheet" href="./css.css" /><div class="camera"><div class="wrapper">')
  css_f.write ('.wrapper{width : ' + str(chips['size']['x']) +'px;height: '+ str(chips['size']['y']) +'px;}')
  replacers = []
  #  process replace
  for spirit, replacer in optimizer['replace'].items() :
    spirit_map[replacer] += spirit_map[spirit] 
    
    replacers.append(replacer)

    spirit_map[spirit] = ()

  spirits_map_items = list(spirit_map.items())
  for spirit, poses in spirits_map_items :
    if spirit not in optimizer['exclude'] :
      if len(poses) == 0 :
        continue
        
      css_class, ext = os.path.splitext(spirit)
      css_class = 'i' + css_class.replace('/','_')
      css_f.write(
        '.' + css_class + '{'
          + 'background-image:url("../../'+spirit+'");'
          + 'width:'  + str(poses[0][2] - poses[0][0]) + 'px;'
          + 'height:' + str(poses[0][3] - poses[0][1]) + 'px;'
          + '}\n')

      if spirit not in optimizer['exclude_compose']:
        poses = compact_poses( poses )

      for pos in poses :
        html_f.write(
          '<div class="block '+ css_class + '" '
              +'style="top:' + str(pos[1]) + 'px;'
                    + 'left:'+ str(pos[0]) + 'px;'
                    + 'height:'+ str(pos[3] - pos[1]) + 'px;'
                    + 'width:' + str(pos[2] - pos[0]) + 'px;'
                    + '"></div>')

  html_f.write('</div></div>')

  html_f.close()
  css_f.close()

# print connect_box_x( pos_to_box((3392, 0, 3408, 8)), pos_to_box((3408, 0, 3424, 8)))
# print connect_box_y( pos_to_box((736, 152, 752, 184)), pos_to_box((736, 184, 752, 200)))