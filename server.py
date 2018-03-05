#!/usr/bin/python

import os

import SimpleHTTPServer
import requests

PORT = 8000
os.system("freeport" + PORT)
# URL = 'localhost:{port}'.format(port=PORT)

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
server = SocketServer.TCPServer(("", PORT), Handler)
print "Serving client on port", PORT

server.serve_forever()