from PIL import Image, ImageOps
import os
from compact import get_rms

def compare_img ( source, target ):
  rms = get_rms( source.convert('RGB'), target.convert('RGB') )
  return rms < 100

def compare_with_mask( source, target ):
  cut_with_mask( source.alpha, target )
  return compare_img( source, target )

def cut_with_mask( alpha, target ):
  target.paste(0, mask=alpha)

def get_alpha ( element ):
  mask = element.split()[-1]
  mask = ImageOps.invert(mask)
  return mask

def pice_compare ( element, dmap, pice ):
  width, height  = dmap.size
  wi, hi = element.size
  if element.mode != 'RGBA' :
    element = element.convert('RGBA')
  if dmap.mode != 'RGBA' :
    dmap    = dmap.convert('RGBA')

  element.alpha = get_alpha( element )
  cut_with_mask( element.alpha, element )
  
  impice = dmap.crop(pice)
  cut_with_mask( element.alpha, impice)

  element.save('element.png')
  impice.save('impice.png')

  return compare_with_mask(element, dmap.crop(pice) )


def find_element_in_map ( element, dmap, offset, step ):
  width, height  = dmap.size
  finds = []
  wi, hi = element.size
  if element.mode != 'RGBA' :
    element = element.convert('RGBA')
  if dmap.mode != 'RGBA' :
    dmap    = dmap.convert('RGBA')

  element.alpha = get_alpha( element )
  cut_with_mask( element.alpha, element )
  for y in xrange(offset["y"], height, step["y"] ):
    for x in xrange(offset["x"], width, step["x"] ):
      pice = (x,y, x + wi, y+hi)
      if compare_with_mask(element, dmap.crop(pice) ) :
        finds.append(pice)
  return finds