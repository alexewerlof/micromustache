.PHONY: clean dist

dist: dist/micromustache.min.js dist/micromustache.js

dist/micromustache.min.js: src/micromustache.js
	uglifyjs src/micromustache.js -o dist/micromustache.min.js --compress --mangle

dist/micromustache.js: src/micromustache.js
	cp src/micromustache.js dist/micromustache.js

dist/readme.html: README.md
	md2html README.md > dist/readme.html

clean:
	rm -rf dist/*