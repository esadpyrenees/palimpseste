#!/usr/bin/env python3 

import time
import socketio

# IP of nodejs server
# https://palimpseste.alwaysdata.net ?
server_ip = 'http://127.0.1:3000/'

def emitMessage(msgType, msg):
  sio = socketio.Client()  
  try:
    with socketio.SimpleClient() as sio:
      print("Trying to connect")    
      sio.connect(server_ip)
      sio.emit(msgType, msg)
      print('I’m connected. My sid is', sio.sid)
      #time.sleep(1)
  except Exception:
    print("Failed to connect")    
    #time.sleep(2)
    emitMessage(msgType, msg)


# Test
# emitMessage("video", "outputfile")