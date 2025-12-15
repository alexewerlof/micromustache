import { describe, it } from 'node:test'
import assert from 'node:assert'
import { render, renderFn, renderFnAsync, ResolveFn, ResolveFnAsync } from '../src/index.js'

describe('render', () => {
    describe('.render()', () => {
        it('uses get() by default', () => {
            assert.strictEqual(render('Hello! My name is {{name}}!', { name: 'Alex' }), 'Hello! My name is Alex!')
        })

        it('returns an empty string if the template is empty', () => {
            assert.strictEqual(render(''), '')
        })

        it('assumes empty value if the key does not exist', () => {
            assert.strictEqual(render('{{i}}', {}), '')
        })

        it('can interpolate a single variable', () => {
            assert.strictEqual(
                render('{{i}}', {
                    i: 'hello',
                }),
                'hello',
            )
            assert.strictEqual(
                render('{{i}} world', {
                    i: 'hello',
                }),
                'hello world',
            )
            assert.strictEqual(
                render('Ahoy! {{i}}', {
                    i: 'hello',
                }),
                'Ahoy! hello',
            )
            assert.strictEqual(
                render('Aloha! {{i}} world', {
                    i: 'hello',
                }),
                'Aloha! hello world',
            )
        })

        it('can replace two variables', () => {
            assert.strictEqual(
                render('{{i}} {{j}}', {
                    i: 'hello',
                    j: 'world',
                }),
                'hello world',
            )
            assert.strictEqual(
                render('{{i}} {{j}}', {
                    i: 'hello',
                    j: 'world',
                }),
                'hello world',
            )
            assert.strictEqual(
                render('{{i}} {{j}} {{k}}', {
                    i: 'hello',
                    j: 'world',
                }),
                'hello world ',
            )
            assert.strictEqual(
                render('{{var1}} {{var2}}', {
                    var1: 'hello',
                    var2: 'world',
                }),
                'hello world',
            )
        })

        it('deals with boolean values properly', () => {
            assert.strictEqual(
                render('{{a}}', {
                    a: true,
                }),
                'true',
            )
            assert.strictEqual(
                render('{{a}}', {
                    a: false,
                }),
                'false',
            )
        })

        it('deals with numerical values properly', () => {
            assert.strictEqual(
                render('{{a}}', {
                    a: 0,
                }),
                '0',
            )
            assert.strictEqual(
                render('{{a}}', {
                    a: 1,
                }),
                '1',
            )
            assert.strictEqual(
                render('{{a}}', {
                    a: 999,
                }),
                '999',
            )
            assert.strictEqual(
                render('{{a}}', {
                    a: Number.NaN,
                }),
                'NaN',
            )
        })

        it('ignores null or undefined values properly', () => {
            assert.strictEqual(
                render('a{{b}}c', {
                    b: null,
                }),
                'ac',
            )
            assert.strictEqual(
                render('a{{b}}c', {
                    b: undefined,
                }),
                'ac',
            )
        })

        it('throws for an invalid path', () => {
            assert.throws(() =>
                render('{{a b}}', {
                    a: 1,
                    b: 2,
                    ab: 3,
                }),
            )
        })

        it('can interpolate multiple occupance of the variable', () => {
            assert.strictEqual(
                render('{{a}}{{a}}{{a}}', {
                    a: 'hello',
                }),
                'hellohellohello',
            )
            assert.strictEqual(
                render('{{a}}{{b}}{{a}}{{b}}', {
                    a: '1',
                    b: '2',
                }),
                '1212',
            )
        })

        it('can access array elements', () => {
            assert.strictEqual(
                render('I like {{0}}, {{1}} and {{2}}', ['orange', 'apple', 'lemon']),
                'I like orange, apple and lemon',
            )
        })

        it('can access array length', () => {
            assert.strictEqual(render('{{length}}', []), '0')
        })

        it('accepts class as scope', () => {
            class Parent {
                constructor(public B = 'Mobile') {}
            }
            class Scope extends Parent {
                public C: string | undefined
                constructor(public A = 'Crocodile') {
                    super()
                }
            }
            const scope = new Scope()
            scope.C = 'Alice'
            assert.strictEqual(render('{{A}} or {{B}} and {{C}}', scope), 'Crocodile or Mobile and Alice')
        })

        it('can access nested objects', () => {
            assert.strictEqual(
                render('{{a}} {{b.c}}', {
                    a: 'hello',
                    b: {
                        c: 'world',
                    },
                }),
                'hello world',
            )
            assert.strictEqual(
                render('{{a}}{{b.c}}', {
                    a: 1,
                    b: {
                        c: 2,
                    },
                }),
                '12',
            )
        })

        it('can access nested objects with three level nesting', () => {
            assert.strictEqual(
                render('{{a}}{{b.c.d}}', {
                    a: 1,
                    b: {
                        c: {
                            d: 3,
                        },
                    },
                }),
                '13',
            )
        })

        it('can access nested objects with six level nesting', () => {
            assert.strictEqual(
                render('{{a.b.c.d.e.f}}', {
                    a: {
                        b: {
                            c: {
                                d: {
                                    e: {
                                        f: 'finally!',
                                    },
                                },
                            },
                        },
                    },
                }),
                'finally!',
            )
        })

        it('if one of the nested keys do not exist, it throws', () => {
            assert.throws(() =>
                render(
                    '{{a.b.c.d.e}}',
                    {
                        a: {
                            b: {
                                c: {
                                    d: {
                                        z: 'Zee?!',
                                    },
                                },
                            },
                        },
                    },
                    { validateRef: true },
                ),
            )
        })

        it('can access nested objects with array index', () => {
            assert.strictEqual(
                render('{{a}}-{{b.1}}', {
                    a: 'a',
                    b: [10, 11],
                }),
                'a-11',
            )
        })

        it('can access objects in an array', () => {
            assert.strictEqual(
                render('{{a.1.b.c}}', {
                    a: [
                        {
                            b: { c: 11 },
                        },
                        {
                            b: { c: 13 },
                        },
                    ],
                }),
                '13',
            )
        })

        it('works for Michael Jackson, so it should work for everyone', () => {
            // I don't have a thing with MJ. Just improvised and it stuck there!
            const singer = {
                first: 'Michael',
                last: 'Jackson',
                children: [
                    {
                        first: 'Paris-Michael',
                        middle: 'Katherine',
                    },
                    {
                        first: 'Prince',
                        middle: 'Michael',
                        prefix: 'II',
                    },
                    {
                        first: 'Michael',
                        middle: 'Joseph',
                        prefix: 'Jr.',
                    },
                ],
            }
            assert.strictEqual(
                render(
                    '{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, ' +
                        '{{children.1.first}} and {{children.2.first}}',
                    singer,
                ),
                'Michael Jackson had 3 children: Paris-Michael, Prince and Michael',
            )
        })
    })

    describe('.renderFn()', () => {
        it('calls the custom resolve function', () => {
            // Just returns the reversed path regardless of value
            const reverseString: ResolveFn = (path) => path.split('').reverse().join('')

            assert.strictEqual(reverseString('Alex'), 'xelA')
            assert.strictEqual(
                renderFn('Hello! My name is {{name}}!', reverseString, {
                    name: 'Alex',
                }),
                'Hello! My name is eman!',
            )
        })

        it('passes the scope to the custom resolve function', () => {
            // Just returns the reversed path regardless of value
            const resolveFn: ResolveFn = (path, obj: any) => obj[path]

            const scope = { name: 'Alex' }
            assert.strictEqual(resolveFn('name', scope), scope.name)
            assert.strictEqual(renderFn('Hello! My name is {{name}}!', resolveFn, scope), 'Hello! My name is Alex!')
        })
    })

    describe('.renderFnAsync()', () => {
        it('passes the scope to the custom resolve function', async () => {
            // Just returns the reversed path regardless of value
            const resolveFn: ResolveFnAsync = async (
                path,
                obj: any,
            ): Promise<string | undefined> => obj[path]

            const scope = { name: 'Alex' }
            assert.strictEqual(await resolveFn('name', scope), scope.name)
            assert.strictEqual(
                await renderFnAsync('Hello! My name is {{name}}!', resolveFn, scope),
                'Hello! My name is Alex!',
            )
        })
    })
})
