import json
import find_element
from PIL import Image, ImageOps

element = Image.open('../other_source/images/mushroom_walk2.png').convert('RGBA')
dmap    = Image.open('../map-sources/180230427271b73d72f05d66.gif').convert('RGBA')

# find_element.pice_compare(element, dmap, (352, 185, 368, 201))
finds = find_element.find_element_in_map( element, dmap, { 'x' : 0, 'y' : 9 }, { 'x' : 1, 'y': 16 })
def map_pice_to_pos( pice ):
  return {
    'left'  : pice[0],
    'top'    : pice[1] - 1,
    'height' : 16,
    'width'  : 16
  }
print json.dumps( map(map_pice_to_pos,finds) )