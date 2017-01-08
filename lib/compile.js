const render = require('./render');

/**
 * @callback Compiler
 *
 * @param {Object} [view={}] - An optional object containing values for
 *        every variable names that is used in the template. If it's omitted,
 *        it'll be assumed an empty object.
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */

/**
 * This function makes repeated calls shorter by returning a compiler function
 * for a particular template that accepts view and returnes the rendered string.
 *
 * It doesn't make the code faster since the compiler still uses render
 * internally.
 *
 * @param {string} template - same as the template parameter to .render()
 * @param {GeneralValueFn} [resolver] - same as the parameter to .render()
 * @returns {Compiler} - a function that accepts a view object and returns a
 *        rendered template string template
 */
function compile (template, resolver) {
  // Create and return a function that will always apply this template
  // and resolver under the hood
  return function compiler (view) {
    return render(template, view, resolver);
  };
}

module.exports = compile;
