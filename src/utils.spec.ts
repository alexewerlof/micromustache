import { isObj, isFn, isStr, isNum, isArr, isInt } from './utils'

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
    [0, undefined, true],
    [0, false, true],
    [0, true, true],
    [1, undefined, true],
    [1, false, true],
    [1, true, true],
    [-1, undefined, true],
    [-1, false, true],
    [-1, true, false],
    [1.1, undefined, false],
    [1.1, false, false],
    [1.1, true, false],
    [-1.1, undefined, false],
    [-1.1, false, false],
    [-1.1, true, false],
    [Number.MAX_SAFE_INTEGER, false, true],
    [Number.MIN_SAFE_INTEGER, false, true],
    [Number.MAX_SAFE_INTEGER, true, true],
    [Number.MIN_SAFE_INTEGER, true, false],
    [null, undefined, false],
    [null, true, false],
    [null, false, false],
    [NaN, undefined, false],
    [NaN, true, false],
    [NaN, false, false],
    [undefined, undefined, false],
    [undefined, true, false],
    [undefined, false, false],
    ['-1', undefined, false],
    ['-1', true, false],
    ['-1', false, false],
    ['0', undefined, false],
    ['0', true, false],
    ['0', false, false],
    ['1', undefined, false],
    ['1', true, false],
    ['1', false, false],
  ])('isInt()', (x, shouldBePositiveOr0, result) => {
    expect(isInt(x, shouldBePositiveOr0)).toBe(result)
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
