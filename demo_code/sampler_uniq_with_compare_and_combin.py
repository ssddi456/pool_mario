#coding=utf-8

from sampler import outputSource
from sampler_uniq_with_md5 import preprocess_with_uniq_test
from sampler_uniq_with_compare_2x2 import unic_diff
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

def sort_by_y_then_x(node):
  return (node['pos'][1],node['pos'][0])

def sort_by_x_then_y(node):
  return (node['pos'][0],node['pos'][1])

def combine ( nodes, connect_func, options ):
  combined = []
  cur_node = nodes[0]
  cur = pos_to_box(cur_node['pos'])

  for node in nodes[1:] :
    if cur_node['piecefile'] == node['piecefile']:

      _box = pos_to_box(node['pos'])
      _cur = connect_func( cur, _box )

      if not _cur :
        cur_node['pos'] = box_to_pos(cur)
        combined.append( cur_node )
        cur_node = node
        cur = _box
      else :
        cur = _cur
    else :
      cur_node['pos'] = box_to_pos(cur)
      combined.append( cur_node )
      
      cur_node = node
      cur = pos_to_box(cur_node['pos'])

  cur_node['pos'] = box_to_pos(cur)
  combined.append( cur_node )
  return combined

def sort_then_combine ( nodes, options ):
  if 'replace' in options :
    _nodes = []
    for node in nodes:
      if node['actualpiece'] in options['replace'] : 
        for_replace = options['replace'][ node['actualpiece'] ]
        if for_replace == '' :
          continue

        node['piecefile'] = options['chip_folder'] + '/' + for_replace + '.gif'

      _nodes.append(node) 

    nodes = _nodes

  nodes = combine(sorted(nodes, key=sort_by_y_then_x),
                   connect_box_x, options)

  nodes = combine(sorted(nodes, key=sort_by_x_then_y),
                   connect_box_y, options)

  return nodes
 

if __name__ == '__main__':

  option  = {
    'chip_folder' : './chips',
    'replace'     : {
                  '0-8'    : '',
                  '0-0'    : '',
                  '144-8'  : '',
                  '176-8'  : '',
                  '32-184' : '800-184'
                }
  };

  name = ''
  piecemap = False

  import json
  
  if False :
    unic_differ = unic_diff()
    name, piecemap = preprocess_with_uniq_test('example.gif', unic_differ.check_img, option)

    try:
      piecemapf = open('piecemap.json','w')
      piecemapf.write( json.dumps(piecemap) )
      piecemapf.close()
    finally:
      pass
  else :
    name = 'example'
    piecemap = json.load(open('piecemap.json','r'))

  piecemap  = sort_then_combine(piecemap, option)

  outputSource(name, piecemap)