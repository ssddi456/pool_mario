# from images2gif import writeGif
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
  sourceImg = Image.open('map-sources/'+file)
  chip = (16,16)
  
  chip_folder = name + '/chips'
  data_folder = name + '/datas'
  pack_folder = name + '/packs'
  packed_folder=name + '/packed'

  mkdir_p(chip_folder)
  mkdir_p(data_folder)

  mkdir_p( pack_folder )
  mkdir_p( packed_folder )
  
  
  size = sourceImg.size
  chips = { 
    'name'          : name,
    'file'          : file,
    'chip_folder'   : chip_folder,
    'data_folder'   : data_folder,
    'chip_folder'   : chip_folder,
    'data_folder'   : data_folder,
    'pack_folder'   : pack_folder,
    'packed_folder' : packed_folder,
    'files'         : [],
    'pos'           : {},
    'size'          : {'x' : size[0],'y': size[1] }
  }

  for x in xrange(0, size[0], 16 ):
    for y in xrange(-8, size[1], 16):
      y = max(0,y)
      x1 = min( size[0], x + 16)
      y1 = min( size[1], y + 16)
      if y == 0 :
        y1 = 8

      pice = (x, y, x1, y1)
      pos  = str(x) + '-' + str(y)
      chips['pos'][pos] = pice
      picefile=chip_folder + '/' + pos +'.gif'
      chips['files'].append(picefile)

      piceImg = sourceImg.crop(pice)
      piceImg.save( picefile )

  dataf = open( data_folder + '/chips.json', 'w+' )
  dataf.write(json.dumps(chips))

  return chips