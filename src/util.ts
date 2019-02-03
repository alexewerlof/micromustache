export function isObject(val: any) {
  return val && typeof val === 'object'
}

export function isString(val: any) {
  return typeof val === 'string'
}

export function isFunction(val: any) {
  return typeof val === 'function'
}

export function assertTruthy(expression: any, errorMessage: string, errorClass: ErrorConstructor = Error) {
  if (!expression) {
    if (errorClass) {
      throw new errorClass(errorMessage);
    }
  }
}
