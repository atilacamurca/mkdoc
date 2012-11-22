#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       mkdoc.py
#       
#       Copyright 2012 Átila Camurça <camurca.home@gmail.com>
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

appdir, filename = os.path.split(os.path.abspath(__file__))
curdir = os.getcwd()

def dir_is_empty():
    return os.listdir(curdir) == []

def init():
    print "initializing project ..."
    if dir_is_empty():
        shutil.copy(appdir + "/template.tex", curdir + "/main.tex")
        # Future release: test for author
        if len(sys.argv) > 2:
            author = sys.argv[2]
        else:
            author = ""
        # Future release: test for title
        if len(sys.argv) > 3:
            title = sys.argv[3]
        else:
            title = ""
        # print author, title
        filename = curdir + "/content.md"
        file = open(filename, 'w')
        file.write("# Introduction")
        file.close()
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
    editor = raw_input('open with [gedit]: ')
    if not editor:
        editor = 'gedit'
    os.system("%s %s &" % (editor, filename))

def view():
    print "compiling project ..."
    os.system("pandoc -t beamer content.md -o content.tex")
    os.system("pdflatex -interaction=nonstopmode main.tex")
    os.system("evince main.pdf &")

def help():
    print """
mkdoc(1)

USAGE
    mkdoc command [options]

COMMANDS
    init - start a project in an empty directory

    edit - open file to edit

     OPTIONS
        -t, --template - open template file to edit instead

    view - generate file and open pdf

    help - show this help
"""

if __name__ == '__main__':
    opts = {'init': init, 'edit': edit, 'view': view, 'help': help}
    if len(sys.argv) > 1:
        command = sys.argv[1]
    else:
        command = None

    opts.get(command, help)()