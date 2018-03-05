#!/usr/bin/python

import os

PORT = 8000
os.system("freeport " + str(PORT))
os.system("python -m SimpleHTTPServer " + str(PORT))