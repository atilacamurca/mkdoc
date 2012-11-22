mkdoc
=====

a simple app to use with pandoc to generate pfd presentations.

Instalation
-----------

Install python, pandoc and latex-beamer first.

Then download, extract the project and:

	# mv mkdoc /usr/local
	# ln -s /usr/local/mkdoc/mkdoc /usr/local/bin

Options
-------

	USAGE
		mkdoc command [options]
		
	COMMANDS
		init - start a project in an empty directory

		edit - open file to edit

		OPTIONS
			-t, --template - open template file to edit instead

		view - generate file and open pdf

		help - show this help
