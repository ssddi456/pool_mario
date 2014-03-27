from PIL import Image
import os
import shutil
import md5
import math
import operator


pics_dic = {}
def open_as_rgb ( file ):
  if not (file in pics_dic) :
    pics_dic[file] = Image.open(file).convert('RGB') 
  return pics_dic[file]

def group_by_content ( files ):
  '''
    ret { hashed : [hashed_sample_files]
          [hash  : [hash same files,...]] ...
        }
  '''
  compared = { "hashed" : [] }
  for file in files:
    sourceImg = open_as_rgb( file )
    hashed = md5_img( sourceImg )
    if hashed in compared :
      compared[hashed].append(file)
    else :
      compared[hashed] = [file]
      compared["hashed"].append(file)
  return compared

def get_tone (im):
  if hasattr ( im, 'tone' ) :
    return im.tone

  width,height = im.size
  tone = [0,0,0]
  for ih in xrange(height):
    for iw in xrange(width):
      r,g,b = im.getpixel((iw,ih))
      tone[0] += r
      tone[1] += g
      tone[2] += b
  count = height*width
  tone[0] /= count
  tone[1] /= count
  tone[2] /= count
  
  im.tone = tone

  return tone

def tone_similar ( im1, im2 ):
  tone1 = get_tone(im1)
  tone2 = get_tone(im2)
  # print tone1, tone2
  return hist_similar( tone1, tone2)

def md5_img ( im ):
  width,height = im.size
  hashed = md5.new()
  for ih in xrange(height):
    for iw in xrange(width):
      r,g,b = im.getpixel((iw,ih))
      hashed.update('-'.join(map(str,[r,g,b])))
  return hashed.hexdigest()

def hist_similar ( h1, h2 ):
  if len(h1) != len(h2) :
    return 9999
  def delta_sq ( a, b ):
    return (a-b)**2
  return sum(map( delta_sq, h1, h2))

def hist_similar_2x2 ( im1, im2 ):
  im1 = im1.convert('RGB')
  im2 = im2.convert('RGB')

  width1, height1 = im1.size
  width2, height2 = im2.size
  if width1 != width2 or height1 != height2 :
    return 9999
  rms = 0
  hw = width1/2
  hh = height1/2
  for wi in xrange(2) :
    for hi in xrange(2):
      chip =( wi*hw, hi*hh, (wi+1) * hw, (hi+1) * hh )
      rms += hist_similar( im1.crop(chip).histogram(), im2.crop(chip).histogram())
  return rms/4

def get_rms ( im1, im2 ):
  return max( hist_similar_2x2(im1, im2), tone_similar(im1, im2) )

def group_by_similar( files ):
  '''
    ret : [[ file , [similar files... (include itself )] ],...]
  '''
  preprocess = []
  for file in files:
    preprocess.append([file,[file]]);
  print len(files)
  
  compared = [preprocess[0]]
  for i in xrange(1,len(preprocess)):
    file2, sublist = preprocess[i]
    rmss=[999,'']
    im2 = open_as_rgb(file2)

    for j in xrange(0,len(compared)):
      # print j, compared[j]
      file1 = compared[j][0]
      im1 = open_as_rgb(file1)
      rms = max( hist_similar_2x2(im1, im2), tone_similar(im1, im2) )

      if rms < 100 :
        if rmss[0] > rms:
          print 'less', rmss[0], rms, file1, file2
          rmss[0] = rms
          rmss[1] = j

    # print rmss
    if rmss[0] < 100 :
      print 'tolerance', rmss[0], rmss[1], compared[rmss[1]], file2
      compared[rmss[1]][1].append( file2 )
    else :
      compared.append(preprocess[i])

  return compared

def simulate_hashed ():
  compared = {}
  for file in os.listdir('.'):
    if file.endswith('.gif') :
      compared[file] = [file]
  return compared

def collect_spirit( imgpack, folder ):
  for imgs in imgpack :
    img = imgs[0]
    shutil.copyfile( img, folder + '/' + os.path.basename(img) )

def compact ( imgpack, folder ):
  bgcolor = (255,255,255)
  for imgs in imgpack :
    imgs = imgs[1]
    count = len( imgs )
    cwidth = math.sqrt(count)
    cheight = cwidth
    if cwidth != math.floor( cwidth ):
      cwidth  = math.ceil(cwidth)
      cheight = math.ceil(count/cwidth)
    
    size = Image.open(imgs[0]).size
    
    cwidth  = int(cwidth )
    cheight = int(cheight)
    
    width  = cwidth * size[0]
    height = cheight * size[1]

    outIm = Image.new('RGB',(width, height))
    try:
      for hi in xrange(cheight):
        for wi in xrange(cwidth):
          c = cwidth * hi + wi
          if count < c:
            raise Exception("img draw end")
          im = imgs[ c ]
          im = open_as_rgb(im).copy()
          outIm.paste( im, ( wi * size[0], hi * size[1] ) )
    except Exception, e:
      pass
    finally:
      outIm.save( folder + '/packed-' + os.path.basename(imgs[0]) )
