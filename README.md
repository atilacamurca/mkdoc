mkdoc
=====

Utility to use with pandoc to generate Beamer Presentations, LaTeX Files, among others
using markdown to write you files. It comes with a web editor to help you edit your files.
The web editor use nodejs.

Instalation
-----------

Install pandoc and latex-beamer first.

    sudo apt-get install pandoc latex-beamer python python-jinja2 python-markdown

Maybe you will need other packages for especific LaTeX code, like `texlive-extra`.

    sudo apt-get install texlive-extra

Install node:

    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install nodejs
    sudo apt-get install build-essential
    sudo npm install -g nodemon

Then download, extract the project, rename to `mkdoc` and:

    sudo mv mkdoc /usr/local
	sudo ln -s /usr/local/mkdoc/mkdoc /usr/local/bin
    cd /usr/local/mkdoc
    npm install
    cd /usr/local/mkdoc/editor
    npm install

<https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions>

#### Complete Version with nodejs (Ubuntu 12.04 32-bits)

<https://www.dropbox.com/s/v8ltpol0cc3rwis/mkdoc-all.deb>

Options
-------

    USAGE
        mkdoc [options] [command]

    COMMANDS
        init - start a project in an empty directory
            options: beamer|latex|io-slides
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
