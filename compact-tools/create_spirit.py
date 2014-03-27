import json
from spirit_to_map import *
from samper import mkdir_p

chips     = json.load( open('180230427271b73d72f05d66/datas/chips.json','r') )
hashed    = json.load( open('180230427271b73d72f05d66/datas/hashed.json','r') )
similared = json.load( open('180230427271b73d72f05d66/datas/similared.json','r') )

spirit_map = spirit_to_map( similared, hashed, chips )

f = open(chips['data_folder'] + '/spirit_map.json','w+')
f.write( json.dumps(spirit_map) )
f.close()

# spirit_map = json.load( open('180230427271b73d72f05d66/datas/spirit_map.json','r') )
out_folder = '180230427271b73d72f05d66/output'
mkdir_p( out_folder )
spirit_opimizer = {
                    'custom_headers' : {
                       "css" : ('../../tools/bg.css',),
                       "js"  : ('../../tools/map_util.js',),
                    },
                    'exclude'    : (
                      '180230427271b73d72f05d66/chips/0-0.gif',
                      '180230427271b73d72f05d66/chips/0-8.gif',
                      # musus
                      '180230427271b73d72f05d66/chips/352-184.gif',
                      '180230427271b73d72f05d66/chips/848-184.gif',
                      '180230427271b73d72f05d66/chips/1280-56.gif',
                      '180230427271b73d72f05d66/chips/1840-184.gif',
                      '180230427271b73d72f05d66/chips/1856-184.gif',
                      '180230427271b73d72f05d66/chips/2000-184.gif',
                      # letters
                      '180230427271b73d72f05d66/chips/912-120.gif',
                      '180230427271b73d72f05d66/chips/928-120.gif',
                      '180230427271b73d72f05d66/chips/1712-168.gif',
                    ),
                    'replace'    : {
                      '180230427271b73d72f05d66/chips/0-216.gif'    : '180230427271b73d72f05d66/chips/0-200.gif',
                      '180230427271b73d72f05d66/chips/3392-216.gif' : '180230427271b73d72f05d66/chips/3392-200.gif',
                      '180230427271b73d72f05d66/chips/352-200.gif'  : '180230427271b73d72f05d66/chips/0-200.gif',
                      '180230427271b73d72f05d66/chips/1280-72.gif'  : '180230427271b73d72f05d66/chips/320-136.gif',

                      '180230427271b73d72f05d66/chips/816-184.gif'  : '180230427271b73d72f05d66/chips/1552-184.gif',
                      '180230427271b73d72f05d66/chips/1552-184.gif' : '180230427271b73d72f05d66/chips/2352-184.gif',
                      
                      '180230427271b73d72f05d66/chips/832-184.gif'  : '180230427271b73d72f05d66/chips/48-168.gif',
                      '180230427271b73d72f05d66/chips/1824-184.gif' : '180230427271b73d72f05d66/chips/48-168.gif',

                      '180230427271b73d72f05d66/chips/1584-184.gif' : '180230427271b73d72f05d66/chips/2352-184.gif',
                      '180230427271b73d72f05d66/chips/1568-184.gif' : '180230427271b73d72f05d66/chips/800-184.gif',

                      '180230427271b73d72f05d66/chips/1712-184.gif' : '180230427271b73d72f05d66/chips/176-184.gif',
                      '180230427271b73d72f05d66/chips/48-184.gif'   : '180230427271b73d72f05d66/chips/2352-184.gif',
                      '180230427271b73d72f05d66/chips/32-184.gif'   : '180230427271b73d72f05d66/chips/800-184.gif',

                      '180230427271b73d72f05d66/chips/3424-24.gif'  : '180230427271b73d72f05d66/chips/3264-184.gif',
                      '180230427271b73d72f05d66/chips/3568-184.gif' : '180230427271b73d72f05d66/chips/3264-184.gif',
                      '180230427271b73d72f05d66/chips/3584-184.gif' : '180230427271b73d72f05d66/chips/3264-184.gif',
                      '180230427271b73d72f05d66/chips/3584-168.gif' : '180230427271b73d72f05d66/chips/3264-184.gif',
                      '180230427271b73d72f05d66/chips/3568-168.gif' : '180230427271b73d72f05d66/chips/3264-184.gif',


                    },
                    'exclude_compose':(
                      '180230427271b73d72f05d66/chips/320-136.gif',
                      '180230427271b73d72f05d66/chips/256-136.gif',
                      '180230427271b73d72f05d66/chips/3456-104.gif'
                    )
                  }
spirit_map_to_html(chips, spirit_map, out_folder, spirit_opimizer)