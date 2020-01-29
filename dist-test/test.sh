#! /usr/bin/env bash

# Exit if any command fails

set -e

node --es-module-specifier-resolution=node --experimental-modules node-cjs-as-esm.mjs
node node-cjs-ext.js
node node-cjs-no-ext.js
node --experimental-modules node-esm-ext.mjs
node --es-module-specifier-resolution=node --experimental-modules node-esm-no-ext.mjs
node node-pkg-traditional.js

echo '+--------------------------------+'
echo '|  All scripts ran successfully  |'
echo '+--------------------------------+'
