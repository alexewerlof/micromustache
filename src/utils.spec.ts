import { isObj, isFn, isStr, isNum, isArr, isInt, optObj } from './utils'

describe('utils', () => {
  it.each([
    [{}, true],
    [[], true],
    [null, false],
    ['', false],
    [true, false],
  ])('isObj()', (x, result) => {
    expect(isObj(x)).toBe(result)
  })

  it.each([
    [{}, false],
    [[], false],
    [null, false],
    ['', false],
    [(): undefined => undefined, true],
    [
      function noOp(): undefined {
        return undefined
      },
      true,
    ],
  ])('isFn()', (x, result) => {
    expect(isFn(x)).toBe(result)
  })

  it.each([
    ['', undefined, true],
    ['', 1, false],
    [[], undefined, false],
    [2, undefined, false],
    [undefined, undefined, false],
  ])('isStr()', (x, minLength, result) => {
    expect(isStr(x, minLength)).toBe(result)
  })

  it.each([
    [1, true],
    [1.1, true],
    [0, true],
    [-1, true],
    [Number.MAX_SAFE_INTEGER, true],
    [Number.MIN_SAFE_INTEGER, true],
    [null, false],
    [NaN, false],
    [undefined, false],
    ['-1', false],
    ['0', false],
    ['1', false],
  ])('isNum()', (x, result) => {
    expect(isNum(x)).toBe(result)
  })

  it.each([
    [1, true],
    [1.1, false],
    [0, true],
    [-1, true],
    [-1.1, false],
    [Number.MAX_SAFE_INTEGER, true],
    [Number.MIN_SAFE_INTEGER, true],
    [null, false],
    [NaN, false],
    [undefined, false],
    ['-1', false],
    ['0', false],
    ['1', false],
  ])('isInt()', (x, result) => {
    expect(isInt(x)).toBe(result)
  })

  it.each([
    [{}, false],
    [[], true],
    [[1, 2, 3], true],
    ['[1,2,3]', false],
    [null, false],
    [true, false],
  ])('isArr()', (x, result) => {
    expect(isArr(x)).toBe(result)
  })
})

describe('optObj()', () => {
  it('throws if the provided value is not an object', () => {
    expect(() => optObj('test', null)).toThrow()
  })

  it('does not throw if it gets an object', () => {
    const options = { foo: 'bar' }
    expect(optObj('test', options)).toBe(options)
  })
})
