mkdoc
=====

Utility to use with pandoc to generate Beamer Presentations, LaTeX Files, among others
using markdown to write you files. It comes with a web editor to help you edit your files.
The web editor use nodejs.

Instalation
-----------

Install pandoc and latex-beamer first.

    $ sudo apt-get install pandoc latex-beamer

Maybe you will need other packages for especific LaTeX code.

Then download, extract the project, rename to `mkdoc` and:

    $ sudo su
	 # mv mkdoc /usr/local
	 # ln -s /usr/local/mkdoc/mkdoc /usr/local/bin

mkdoc editor
------------

A web editor develop under node.js as server and html5 as client.

### Installation:

    $ sudo su
    # apt-get install nodejs npm

requires version v0.10.20 or higher.

#### For development:

    # npm install -g nodemon

#### Complete Version with nodejs

<https://www.dropbox.com/s/v8ltpol0cc3rwis/mkdoc-all.deb>

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
