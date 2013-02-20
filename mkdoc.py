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

appdir, filename = os.path.split(os.path.abspath(__file__))
curdir = os.getcwd()

def dir_is_empty():
    return os.listdir(curdir) == []

def init():
    sys.stdout.write("initializing project... ")
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
        file.write("""% Describe your presentation here
# Introduction

### Introduction
""")
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
    print "compiling project ..."
    os.system("pandoc -t beamer content.md -o content.tex")
    os.system("pdflatex -interaction=nonstopmode main.tex")
    os.system("xdg-open main.pdf")

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
            'docs': docs, 'cleanup': cleanup}
    if len(sys.argv) > 1:
        command = sys.argv[1]
    else:
        command = None

    opts.get(command, help)()
