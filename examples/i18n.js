const { parseTemplate, stringify, getPath } = require('../')

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

  function resolve(path) {
    const resolvedValue = getPath(scope, path)
    if (resolvedValue instanceof Date) {
      return localizationTable[lang].dayNames[resolvedValue.getDay()]
    }
    return resolvedValue
  }

  const parsedTemplate = parseTemplate(template)
  return stringify(parsedTemplate.strings, parsedTemplate.paths.map(resolve))
}

const scope = {
  name: 'Alex',
  today: new Date(),
}

// Hi! My name is Alex and today is Friday
console.log(__('greet', scope, 'en'))
// Hej! Jag heter Alex och idag är det fredag
console.log(__('greet', scope, 'sv'))
