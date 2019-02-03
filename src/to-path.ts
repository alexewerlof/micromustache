import { isString } from './util';

export function toPath(path: string) : string[] {
  if (!isString(path)) {
    throw new TypeError(`Path must be a string but it is ${typeof path}: ${path}`);
  }
  if (path.trim() === '') {
    return [];
  }

  const keys = path
    // convert ["something"] to .something (considering all valid js string delimiters)
    .replace(/\[\s*(['"`])?\s*(\S+)\s*(\1)\s*\]/g, '.$2')
    // Strip any . from the start of the string
    .replace(/^\./g, '')
    .split('.')
    .map(key => key.trim());

  // check that all pieces are syntactically correct
  keys.forEach(key => {
    if (key.length === 0) {
      throw new SyntaxError(`Part of the path is empty: ${path}`)
    }
    if (/[\[\]'"`]/.test(key)) {
      throw new SyntaxError(`${path} resulted to an invalid key ${key}`);
    }
  });

  return keys;
}
