mkdoc
=====

a simple app to use with pandoc to generate pfd presentations.

Instalation
-----------

Install python, pandoc and latex-beamer first.

    $ sudo apt-get install pandoc latex-beamer

Maybe you will need other packages for especific LaTeX code.

Then download, extract the project, rename to `mkdoc` and:

    $ sudo su
	# mv mkdoc /usr/local
	# ln -s /usr/local/mkdoc/mkdoc /usr/local/bin

Options
-------

    USAGE
        mkdoc command [options]

    COMMANDS
        init - start a project in an empty directory
            options: beamer|latex
            default: beamer

        edit - open file to edit
            options:
            -t, --template - open template file to edit instead

        view - generate file and open pdf

        help - show this help

        docs - show the documentation of mkdoc in the default browser

        cleanup - remove log and aux files
