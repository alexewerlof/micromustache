import { describe, it } from 'node:test'
import assert from 'node:assert'
import { isObj, isFn, isStr, isNum, isArr, isInt } from '../src/utils.js'

describe('utils', () => {
    describe('isObj()', () => {
        const testCases = [
            [{}, true],
            [[], true],
            [null, false],
            ['', false],
            [true, false],
        ]
        for (const [x, result] of testCases) {
            it(`should return ${result} for ${JSON.stringify(x)}`, () => {
                assert.strictEqual(isObj(x), result)
            })
        }
    })

    describe('isFn()', () => {
        const testCases = [
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
        ]
        for (const [x, result] of testCases) {
            const desc = typeof x === 'function' ? 'a function' : JSON.stringify(x)
            it(`should return ${result} for ${desc}`, () => {
                assert.strictEqual(isFn(x), result)
            })
        }
    })

    describe('isStr()', () => {
        const testCases: [unknown, undefined | number, boolean][] = [
            ['', undefined, true],
            ['', 1, false],
            [[], undefined, false],
            [2, undefined, false],
            [undefined, undefined, false],
        ]
        for (const [x, minLength, result] of testCases) {
            it(`should return ${result} for ${JSON.stringify(x)} with minLength ${minLength}`, () => {
                assert.strictEqual(isStr(x, minLength), result)
            })
        }
    })

    describe('isNum()', () => {
        const testCases = [
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
        ]
        for (const [x, result] of testCases) {
            it(`should return ${result} for ${String(x)}`, () => {
                assert.strictEqual(isNum(x), result)
            })
        }
    })

    describe('isInt()', () => {
        const testCases = [
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
        ]
        for (const [x, result] of testCases) {
            it(`should return ${result} for ${String(x)}`, () => {
                assert.strictEqual(isInt(x), result)
            })
        }
    })

    describe('isArr()', () => {
        const testCases = [
            [{}, false],
            [[], true],
            [[1, 2, 3], true],
            ['[1,2,3]', false],
            [null, false],
            [true, false],
        ]
        for (const [x, result] of testCases) {
            it(`should return ${result} for ${JSON.stringify(x)}`, () => {
                assert.strictEqual(isArr(x), result)
            })
        }
    })
})
