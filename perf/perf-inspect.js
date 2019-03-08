const micromustache = require('../lib/index')

const ITERATIONS = 100000

const scope = {
  st: 'name',
  ob: {
    st: 'name',
    n: 13
  },
  nil: null,
  bool: true,
  arr: [1, 2, 3, 4],
  arrNested: [
    {
      st: 'a'
    },
    {
      st: 'b'
    },
    {
      st: 'c'
    }
  ]
}

const template = `hi {{ob}} {{ob}} {{ob}} {{arr}} {{arr}} {{arr}} {{arrNested}} {{nil}} {{nil}} {{nil}} {{nothing}} {{arrNested.nothing}} {{st}} {{st}} {{ob.st}} {{ob[st]}} {{ob.n}} {{bool}} {{arr[1]}} {{arr.length}} {{arrNested.1}} {{arrNested.1.st}} {{arrNested[2].st}} {{arrNested[2].st}} {{arrNested[2].st}} {{arrNested[2].st}} bye`

const renderer = micromustache.compile(template)

function compiled() {
  return renderer.render(scope)
}

function render() {
  return micromustache.render(template, scope)
}

console.time('compiled')
for (let i = 0; i < ITERATIONS; i++) {
  compiled()
}
console.timeEnd('compiled')

console.time('render')
for (let i = 0; i < ITERATIONS; i++) {
  render()
}
console.timeEnd('render')
