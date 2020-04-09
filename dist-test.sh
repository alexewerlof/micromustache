#! /usr/bin/env bash

# Exit if any command fails

set -e

node --es-module-specifier-resolution=node --experimental-modules dist-test/node-cjs-as-esm.mjs
node dist-test/node-cjs-ext.js
node dist-test/node-cjs-no-ext.js
node --experimental-modules dist-test/node-esm-ext.mjs
node --es-module-specifier-resolution=node --experimental-modules dist-test/node-esm-no-ext.mjs
node dist-test/node-pkg-traditional.js

echo '+--------------------------------+'
echo '|  All scripts ran successfully  |'
echo '+--------------------------------+'
