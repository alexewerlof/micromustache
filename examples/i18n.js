const { parse, stringify, resolve } = require('../')

const localizationTable = {
  en: {
    greet: 'Hi! My name is {{name}} and today is {{today}}',
    dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  sv: {
    greet: 'Hej! Jag heter {{name}} och idag är det {{today}}',
    dayNames: ['måndag', 'tisdag', 'onsdag', 'tursdag', 'fredag', 'lördag', 'söndag'],
  },
}

function __(key, scope, lang) {
  const template = localizationTable[lang][key]

  const parsedTemplate = parse(template)
  const { strings, subs } = resolve(parsedTemplate, scope)
  return stringify({
    strings,
    subs: subs.map((sub) =>
      sub instanceof Date ? localizationTable[lang].dayNames[sub.getDay()] : sub
    ),
  })
}

const scope = {
  name: 'Alex',
  today: new Date(),
}

// Hi! My name is Alex and today is Friday
console.log(__('greet', scope, 'en'))
// Hej! Jag heter Alex och idag är det fredag
console.log(__('greet', scope, 'sv'))
