import { isFunction } from './util';
import { IStringifyOptions } from './types';

const OBJECT_TO_STRING = Object.prototype.toString;

/**
 * Converts a value to a string
 * If value is an object with a toString() function, that is used to convert it to string.
 * Otherwise JSON.stringify() is used
 * @param value
 * @param options the options from compile()
 * @returns the value converted to string
 */
export function stringify(value: any, { invalidType = '', invalidObj = '{...}'}: IStringifyOptions = {}): string | number | boolean {
  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value as string;
    case 'number':
      if (isNaN(value)) {
        return ''
      }
      if (value === Number.POSITIVE_INFINITY) {
        return '∞'
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return '-∞'
      }
      return value
    case 'object':
      // null is an object but is falsy. Swallow it.
      if (value === null) {
        return ''
      }
      if (isFunction(value.toString) && value.toString !== OBJECT_TO_STRING) {
        return value.toString();
      }
      try {
        return JSON.stringify(value);
      } catch (jsonError) {
        return invalidObj;
      }
    case 'undefined':
      return '';
    default:
      // Anything else will be replaced with an empty string
      // For example: undefined, Symbol, etc.
      return invalidType;
  }
}
