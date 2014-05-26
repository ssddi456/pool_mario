import json
from spirit_to_map import *
from samper import mkdir_p

base_name = 'e985521a4d6a9e378718bf60'
chips     = json.load( open( base_name + '/datas/chips.json','r') )
hashed    = json.load( open( base_name + '/datas/hashed.json','r') )
similared = json.load( open( base_name + '/datas/similared.json','r') )

spirit_map = spirit_to_map( similared, hashed, chips )

# f = open(chips['data_folder'] + '/spirit_map.json','w+')
# f.write( json.dumps(spirit_map) )
# f.close()

# spirit_map = json.load( open(chips['data_folder'] + '/spirit_map.json','r'))

out_folder =  base_name + '/output'
mkdir_p( out_folder )
chips_folder = base_name + '/chips/'
spirit_opimizer = {
                    'custom_headers' : {
                       "css" : ('../../imps/bg.css',),
                       "js"  : ('../../imps/map_util.js',),
                    },
                    "exclude":(
                      chips_folder + "0-8"      + '.gif',
                      chips_folder + "1872-120" + '.gif',
                      chips_folder + "1856-120" + '.gif',
                      chips_folder + "336-120"  + '.gif',
                      chips_folder + "352-120"  + '.gif',
                      chips_folder + "336-136"  + '.gif',
                      chips_folder + "352-136"  + '.gif',
                      chips_folder + "2112-104" + '.gif',
                      chips_folder + "2112-88"  + '.gif',
                      chips_folder + "2128-88"  + '.gif',
                      chips_folder + "2608-136" + '.gif',
                      chips_folder + "2624-136" + '.gif',
                    ),
                    "exclude_compose":(
                      chips_folder + "400-72"   + '.gif',
                      chips_folder + "656-136"  + '.gif',
                      chips_folder + "2384-136" + '.gif',
                      chips_folder + "3872-120" + '.gif',
                      chips_folder + "3824-24"  + '.gif'
                    ),
                    "replace":{
                    
                      chips_folder + "4016-168" + '.gif' : chips_folder + "0-184" + '.gif',
                      chips_folder + "4000-168" + '.gif' : chips_folder + "0-184" + '.gif'
                    },
                  }

spirit_map_to_html( chips, spirit_map, out_folder, spirit_opimizer)