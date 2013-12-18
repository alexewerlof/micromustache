/*!
 * micromustache.js - Stripped down version of the {{mustache}} template engine with JavaScript
 * @license Creative Commons V3
 */

var MicroMustache = (function () {

    //the object that will be returned as the public interface of this module
    var exports = {};

    //the regular expression that is used for looking up the variable names
    exports._rex = /\{?\{\{\s*(.*?)\s*\}\}\}?/g;

    exports._repFn = function (vars) {
        return function (match, varName) {
            var value = vars[varName];
            switch (typeof value) {
                case 'string':
                case 'number':
                case 'boolean':
                    return value;
                case 'function':
                    //if the value is a function, call it passing the variable name
                    return value(varName);
                default:
                    //anything else will be replaced with an empty string. This includes object and null.
                    return '';
            }
        };
    };

    /**
     * Replaces every {{variable}} inside the template with values provided by vars
     * @param template {string} the template containing one or more {{key}}
     * @param vars {object} an object containing string (or number) values for every key that is used in the template
     * @return {string} template with its valid variable names replaced with corresponding values
     */
    exports.to_html = exports.render = function (template, vars) {
        //don't touch the template if it is not a string
        if (typeof template !== 'string') {
            return template;
        }
        //if vars is not a valid object, assume an empty dictionary which effectively removes all variable assignments
        if (typeof vars !== 'object' || vars === null) {
            vars = {};
        }
        return template.replace(exports._rex, exports._repFn(vars));
    };

    /**
     * This function really doesn't make things particularly faster.
     * However it makes the repeated calls shorter!
     * @param template {string} the template containing one or more {{key}}
     * @return {function} a function that calls render(template, vars) under the hood
     */
    exports.compile = function (template) {
        //create and return a function that will always apply this template under the hood
        return function (vars) {
            return exports.render(template, vars);
        };
    };

    return exports;
})();