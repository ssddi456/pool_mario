import samper
import compact
import os
import json

chips  = samper.preprocess_file('e985521a4d6a9e378718bf60.gif')

hashed = compact.group_by_content(chips["files"])
f = open( chips["data_folder"] + '/hashed.json', 'w+' )
f.write( json.dumps(hashed) )
f.close()

similared = compact.group_by_similar(hashed["hashed"])

f = open( chips["data_folder"] + '/similared.json', 'w+' )
f.write( json.dumps(similared) )
f.close()

compact.collect_spirit(similared, chips["pack_folder"] )
compact.compact(similared,        chips["packed_folder"] )