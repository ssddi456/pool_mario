import os
for file in os.listdir('.') :
  if file.endswith('.jpg') :
    name, ext = os.path.splitext(file) 
    os.rename(file, name +'.gif')