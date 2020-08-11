/*global micromustache*/

/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const examples = [
  {
    name: 'Simple',
    template: 'Hello {{name}}!',
    scope: {
      name: 'Alex',
    },
  },
  {
    name: 'Array',
    template: 'I like {{0}}, {{4}} and {{[2]}} out of {{length}} fruits!',
    scope: ['Apple', 'Orange', 'Banana', 'Citrun', 'Tomato'],
  },
  {
    name: 'Nested',
    template: "{{person.name}}'s mobile nr is: {{person.contacts.tel[1].nr}}!",
    scope: {
      person: {
        name: 'Alex',
        contacts: {
          address: 'Stockholm, Sweden',
          tel: [
            {
              nr: '+4600000000',
            },
            {
              nr: '+4611111111',
            },
          ],
        },
      },
    },
  },
]

const getEl = (id) => document.getElementById(id)
const createEl = (tagName) => document.createElement(tagName)
const text = (el, contents) => (el.innerText = contents)
const getVal = (el) => el.value
const setVal = (el, value) => (el.value = value)
const on = (el, eventName, handler) => el.addEventListener(eventName, handler)
const fire = (el, eventName) => el.dispatchEvent(new Event(eventName))
const ready = (fn) =>
  ['complete', 'interactive'].includes(document.readyState)
    ? fn()
    : on(document, 'DOMContentLoaded', fn)

const exampleSelector = getEl('example-selector')
const template = getEl('template')
const optionsToggle = getEl('options-toggle')
const templateError = getEl('template-error')
const scope = getEl('scope')
const scopeError = getEl('scope-error')
const result = getEl('result')
const resultError = getEl('result-error')

function runFn(successEl, errorEl, fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected a function. Got ${fn}`)
  }
  try {
    const result = fn()
    successEl.classList.remove('error')
    text(errorEl, '')
    return result
  } catch (err) {
    successEl.classList.add('error')
    text(errorEl, '⛔ ' + err)
  }
}

function render() {
  // Handle the template errors
  const renderer = runFn(template, templateError, () =>
    micromustache.compile(getVal(template), { validateVarNames: true })
  )
  // Handle the scope errors
  const scopeObj = runFn(scope, scopeError, () => JSON.parse(getVal(scope)))

  if (!renderer || !scopeObj) {
    return text(result, '')
  }

  // If all is well try to generate the results handling the errors
  text(
    result,
    runFn(result, resultError, () => renderer.render(scopeObj))
  )
}

ready(() => {
  examples.forEach((example, i) => {
    const option = createEl('option')
    text(option, example.name)
    setVal(option, i)
    exampleSelector.appendChild(option)
  })
  on(optionsToggle, 'click', () => {
    const contents = optionsToggle.nextElementSibling
    contents.hidden = !contents.hidden
  })
  on(scope, 'keyup', render)
  on(template, 'keyup', render)
  on(exampleSelector, 'change', () => {
    const example = examples[getVal(exampleSelector)]
    setVal(template, example.template)
    setVal(scope, JSON.stringify(example.scope, null, 2))
    render()
  })
  fire(exampleSelector, 'change')
})
