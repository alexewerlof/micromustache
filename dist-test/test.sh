#! /usr/bin/env bash

# Exit if any command fails

set -e

node node-cjs.js
node --es-module-specifier-resolution=node --experimental-modules node-esm.mjs
node --es-module-specifier-resolution=node --experimental-modules node-cjs-as-esm.mjs

echo '+--------------------------------+'
echo '|  All scripts ran successfully  |'
echo '+--------------------------------+'