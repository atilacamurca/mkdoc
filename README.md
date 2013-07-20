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
    # apt-get install nodejs

 For development:

    # npm install -g nodemon

Options
-------

    USAGE
        mkdoc command [options]

    COMMANDS
        init - start a project in an empty directory
            options: beamer|latex
            default: beamer

        editor - open a web editor (needs nodejs)

        edit - open file to edit
            options:
            -t, --template - open template file to edit instead

        view - generate file and open pdf

        help - show this help

        docs - show the documentation of mkdoc in the default browser

        cleanup - remove log and aux files
