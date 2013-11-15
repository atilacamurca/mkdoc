mkdoc
=====

a simple app to use with pandoc to generate pdf presentations.

Instalation
-----------

Install python, pandoc and latex-beamer first.

    $ sudo apt-get install pandoc latex-beamer

Maybe you will need other packages for especific LaTeX code.

Then download, extract the project, rename to `mkdoc` and:

    $ sudo su
	 # mv mkdoc /usr/local
	 # ln -s /usr/local/mkdoc/mkdoc /usr/local/bin

mkdoc editor
------------

A web editor develop under node.js as server and html5 as client.

Installation:

    $ sudo su
    # apt-get install nodejs npm

requires version v0.10.20 or higher.

For development:

    # npm install -g nodemon

Options
-------

    USAGE
        mkdoc [options] [command]

    COMMANDS
        init - start a project in an empty directory
            options: beamer|latex
            default: beamer

        editor - open a web editor (needs nodejs)

        edit [file] - open file to edit
        
        template - open template file to edit instead

        view - generate file and open pdf

        docs - show the documentation of mkdoc in the browser

        cleanup - remove log and aux files

    OPTIONS
        -h, --help - show this help
        -V, --version  show version
