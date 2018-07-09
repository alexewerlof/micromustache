const { _resolve, _defaultResolver, _valueToString } = require('./resolve')

/**
 * replaces all occurances of {{ varName }} in the template
 * with what is returned from the resolver function
 *
 * @param {string} template - the template
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every {{varName}} to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm (find the value from the view
 *        object).
 * @param {*} view - an object that will be passed to the resolver
 * @returns {string} - the resulting string
 */
function _replace(template, resolver, view) {
  let currentIndex, openIndex, closeIndex, before, varname
  const parts = []
  for (currentIndex = -2; currentIndex < template.length;) {
    openIndex = template.indexOf('{{', currentIndex)
    if (openIndex === -1) {
      break;
    }
    closeIndex = template.indexOf('}}', openIndex)
    if (closeIndex === -1) {
      break;
    }
    varname = template.substring(openIndex + 2, closeIndex).trim()
    closeIndex += 2
    before = template.substring(currentIndex, openIndex)
    currentIndex = closeIndex

    parts.push(before)
    parts.push(_valueToString(_resolve(resolver, varname, view)))
  }
  parts.push(template.substring(closeIndex))
  return parts.join('')
}

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param {string} template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param {Object} [view={}] - An object containing values for every variable names that is used in
 *        the template. If it's omitted, it'll be set to an empty object essentially removing all
 *        {{varName}}s in the template.
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every {{varName}} to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm (find the value from the view
 *        object).
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
function render (template, view = {}, resolver = _defaultResolver) {
  // don't touch the template if it is not a string
  if (typeof template !== 'string') {
    return template;
  }

  return _replace(template, resolver, view);
}

module.exports = render;
