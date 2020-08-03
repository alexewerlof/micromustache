#! /usr/bin/env bash

# Exit if any command fails

set -e

node ./node-cjs-ext.js
node ./node-cjs-no-ext.js
node ./node-cjs-no-ext-default.js

node --es-module-specifier-resolution=node --experimental-modules ./node-esm.mjs
node --experimental-modules ./node-esm-ext.mjs
node --es-module-specifier-resolution=node --experimental-modules ./node-esm-use-cjs.mjs

echo '+--------------------------------+'
echo '|  All scripts ran successfully  |'
echo '+--------------------------------+'
