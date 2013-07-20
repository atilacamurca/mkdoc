#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       mkdoc.py
#       
#       Copyright 2013 Átila Camurça <camurca.home@gmail.com>
#       
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.
#
import sys
import os
import shutil
import json

appdir, filename = os.path.split(os.path.abspath(__file__))
curdir = os.getcwd()
CONFIG_FILE = ".config.json"


def dir_is_empty():
    return os.listdir(curdir) == []


def init():
    sys.stdout.write("initializing project... ")
    if dir_is_empty():
        if len(sys.argv) > 2:
            type = sys.argv[2]
        else:
            type = "beamer"
        shutil.copy(appdir + "/" + type + ".tex", curdir + "/main.tex")
        filename = curdir + "/content.md"
        file = open(filename, 'w')
        file.write("""<!-- your text here -->""")
        file.close()
        # config file
        config = {"type": type}
        data_string = json.dumps(config)
        filename = "%s/%s" % (curdir, CONFIG_FILE)
        file = open(filename, 'w')
        file.write(data_string)
        file.close()
        print "done."
    else:
        print "[ERROR] directory is not empty."


def edit():
    print 'editing project ...'
    if len(sys.argv) > 2:
        opt = sys.argv[2]
        filename = 'main.tex'
        if not opt in ('-t', '--template'): print '[ERROR] option %s not found.' % opt; return
    else:
        filename = 'content.md'
    editor = raw_input('open with [blank for default]: ')
    if not editor:
        editor = 'xdg-open'
    os.system("%s %s &" % (editor, filename))


def view():
    json_data = open(CONFIG_FILE)
    data = json.load(json_data)
    print "compiling project ..."
    os.system("pandoc -t %s content.md -o content.tex" % data["type"])
    os.system("pdflatex -shell-escape -interaction=nonstopmode main.tex")
    os.system("xdg-open main.pdf")
    json_data.close()


def editor():
    print "opening mkdoc-editor ... "
    editor_path = "%s/editor/" % appdir
    os.system("xdg-open http://localhost:9669")
    os.system("cd %s && nodemon server.js %s" % (editor_path, curdir))


def help():
    print """
mkdoc(1)

USAGE
    mkdoc command [options]

COMMANDS
    init - start a project in an empty directory
        options: beamer|latex
        default: beamer

    editor - open a web editor

    edit - open file to edit
        options:
        -t, --template - open template file to edit instead

    view - generate file and open pdf

    help - show this help

    docs - show the documentation of mkdoc in the default browser

    cleanup - remove log and aux files
"""


def docs():
    url = "file://%s/docs/index.html" % appdir
    os.system("xdg-open %s" % url)


def cleanup():
    os.system("cd %s && ls *.aux *.log *.nav *.out *.snm *.toc" % curdir)
    answer = raw_input("Confirm remove? _yes/[no]: ")
    if answer in ('y', 'yes'):
        os.system("cd %s && rm *.aux *.log *.nav *.out *.snm *.toc" % curdir)

if __name__ == '__main__':
    opts = {'init': init, 'edit': edit, 'view': view, 'help': help,
            'docs': docs, 'cleanup': cleanup, 'editor': editor}
    if len(sys.argv) > 1:
        command = sys.argv[1]
    else:
        command = None

    opts.get(command, help)()
