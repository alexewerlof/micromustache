const compile = require('./compile')

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param {string} template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param {Object} [view={}] - An object containing values for every variable names that is used in
 *        the template. If it's omitted, it'll be set to an empty object essentially removing all
 *        {{varName}}s in the template.
 * @param {Object} [options] - same as compiler options
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
function render (template, view = {}, options) {
  const compiler = compile(template, options)
  return compiler(view);
}

module.exports = render;
