#coding=utf-8

from sampler import outputSource
from sampler_uniq_with_md5 import preprocess_with_uniq_test

def hist_similar ( h1, h2 ):
  if len(h1) != len(h2) :
    return 9999
  def delta_sq ( a, b ):
    return (a-b)**2
  return sum(map( delta_sq, h1, h2))

def hist_similar_2x2( hs1, hs2 ):
  rms = 0
  for i in xrange(4):
    rms += hist_similar(hs1[i], hs2[i] )
  return rms/4

def get_pos_and_histogram( im ):
  im = im.convert('RGB')

  width, height = im.size

  rms = 0
  hw = width/2
  hh = height/2

  histograms = []

  for wi in xrange(2) :
    for hi in xrange(2):
      chip =( wi*hw, hi*hh, (wi+1) * hw, (hi+1) * hh )
      histograms.append(im.crop(chip).histogram())
  return histograms

class unic_diff(object):
  """docstring for unic_diff"""
  def __init__(self):
    self.uniq_map = []
  def check_img(self, node, pic_data):
    node_histogram = get_pos_and_histogram(pic_data.convert('RGB'))
    rms = 9999
    temp_similar_node = False
    for sample_node in self.uniq_map : 
      _rms = hist_similar_2x2( node_histogram, sample_node['histogram'] )
      if _rms < rms :
        rms = _rms
        temp_similar_node = sample_node

    if rms < 100 :
      return True, temp_similar_node
    else :
      node['histogram'] = node_histogram
      self.uniq_map += [ node ]
      return False, node 

if __name__ == '__main__':
  unic_differ = unic_diff()
  outputSource(*preprocess_with_uniq_test('example.gif', unic_differ.check_img))