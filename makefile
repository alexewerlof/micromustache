.PHONY: clean

deploy/micromustache.js: src/micromustache.js
	uglifyjs src/micromustache.js -o deploy/micromustache.js --compress --mangle

deploy/readme.html: README.md
	md2html README.md > deploy/readme.html

clean:
	rm -rf deploy/*