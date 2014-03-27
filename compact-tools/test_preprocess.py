import samper
import compact
import os
import json

chips  = samper.preprocess_file('180230427271b73d72f05d66.gif')
# chips  = json.load( open('180230427271b73d72f05d66/datas/180230427271b73d72f05d66.json','r') )

hashed = compact.group_by_content(chips["files"])
f = open( chips["data_folder"] + '/hashed.json', 'w+' )
f.write( json.dumps(hashed) )
f.close()

# hashed  = json.load( open('180230427271b73d72f05d66/datas/hashed.json','r') )

similared = compact.group_by_similar(hashed["hashed"])

f = open( chips["data_folder"] + '/similared.json', 'w+' )
f.write( json.dumps(similared) )
f.close()

compact.collect_spirit(similared, chips["pack_folder"] )
compact.compact(similared,        chips["packed_folder"] )