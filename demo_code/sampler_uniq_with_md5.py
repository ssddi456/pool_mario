#coding=utf-8

import md5
import os
from sampler import *
from PIL import Image

def md5_img ( im ):
  width,height = im.size
  hashed = md5.new()
  for ih in xrange(height):
    for iw in xrange(width):
      r,g,b = im.getpixel((iw,ih))
      hashed.update('-'.join(map(str,[r,g,b])))
  return hashed.hexdigest()

def preprocess_with_uniq_test ( file, 
                                unic_func, 
                                option={'chip_folder' : './chips'} ):
  name, ext = os.path.splitext(file) 
  name = os.path.basename(name)

  sourceImg = Image.open( file )

  ## chip size
  chip = (16,16)

  chip_folder = option['chip_folder']
  
  mkdir_p(chip_folder)

  size = sourceImg.size
  piecemap = []

  # 遍历画布
  for x in xrange(0, size[0], 16 ):
    for y in xrange(-8, size[1], 16):
      y = max(0,y)
      # 计算右下角位置
      x1 = min( size[0], x + 16)
      y1 = min( size[1], y + 16)
      if y == 0 :
        y1 = 8
      # bounding box
      piece = (x, y, x1, y1)
      
      # 位置标识符 以左上为基准
      pos  = str(x) + '-' + str(y)
      
      # 存储切片
      piecefile=chip_folder + '/' + pos +'.gif'
      pieceImg = sourceImg.crop(piece)
      node     = {
        'pos'       : piece,
        'piecename' : pos,
        'piecefile' : piecefile
      }
      # 加入相似度判断
      same, similar_node = unic_func( node, pieceImg )

      if not same : 
        pieceImg.save( piecefile )
      else :
        node['piecefile'] = similar_node['piecefile']

      node['actualpiece'] = similar_node and similar_node['piecename'] or node['piecename']

      piecemap += [ node ]
  return name, piecemap

class unic_diff(object):
  """docstring for unic_diff"""
  def __init__(self):
    self.uniq_map = {}
  def check_img(self, node, pic_data):
    hashed = md5_img(pic_data.convert('RGB'))
    if hashed in self.uniq_map :
      return True, self.uniq_map[hashed]
    else :
      self.uniq_map[hashed] = node
      return False, node

if __name__ == '__main__':
  unic_differ = unic_diff()
  outputSource(*preprocess_with_uniq_test('example.gif', unic_differ.check_img))