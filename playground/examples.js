const examples = [
  {
    name: 'Simple',
    template: 'Hello {{name}}!',
    scope: {
      name: 'Alex',
    },
  },
  {
    name: 'Spaces',
    template: '{{ person  . name}} is {{  person ["age"]   }} years old',
    scope: {
      person: {
        name: 'Dale',
        age: 17,
      },
    },
  },
  {
    name: 'Undefined and null',
    template: 'Try the "explicit" option. Null is "{{n}}" and undefined is "{{u}}"',
    scope: {
      n: null,
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
