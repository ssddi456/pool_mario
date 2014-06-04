#coding=utf-8

from PIL import Image
import os
import errno
import json

def mkdir_p(path):
  try:
    os.makedirs(path)
  except OSError as exc: # Python >2.5
    if exc.errno == errno.EEXIST and os.path.isdir(path):
      pass
    else: raise

def preprocess_file( file ):
  name, ext = os.path.splitext(file) 
  name = os.path.basename(name)

  sourceImg = Image.open( file )

  ## chip size
  chip = (16,16)

  chip_folder = './chipes'
  
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
      piecename  = str(x) + '-' + str(y)
      
      # 存储切片
      piecefile= chip_folder + '/' + piecename +'.gif'
      pieceImg = sourceImg.crop(piece)
      pieceImg.save( piecefile )
      piecemap += [{
        'piecefile'   : piecefile,
        'pos'         : piece,
        'piecename'   : piecename
      }]
  return name, piecemap

def outputSource ( name, piecemap ):
  
  html = '<link rel="stylesheet" href="css.css" /><div class="wrapper">'
  css  = '.block{position:absolute;}'

  for piece in piecemap :
    pos = piece['pos']

    # 生成html和css
    css_class ='i' + name + '_' + piece['piecename'];
    css +=  str('.' + css_class + '{' +
                'background-image:url("'+ piece['piecefile'] +'");' +
                'top:'    + str(pos[1]) + 'px;' +
                'left:'   + str(pos[0]) + 'px;' +
                'width:'  + str(pos[2] - pos[0]) + 'px;' +
                'height:' + str(pos[3] - pos[1]) + 'px;' +
                '}\n')
    html+= '<div class="block '+ css_class + '" ></div>\n'
  
  html+='</div>'
  html+='<script src="http://cdn.staticfile.org/jquery/2.0.3/jquery.js"></script>'
  html+='<script src="util.js"></script>'
  # 把html和css写入文件
  css_f  = open ( './css.css',   'w+' )
  css_f.write( css )
  css_f.close()

  html_f = open ( './html.html', 'w+' )
  html_f.write(html)
  html_f.close()

if __name__ == '__main__':
  outputSource( *preprocess_file('example.gif') )