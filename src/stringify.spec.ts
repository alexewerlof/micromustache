import { stringify } from './stringify'

describe('stringify()', () => {
  it('Converts a parsed template to string', () => {
    expect(
      stringify({
        strings: ['Hi', 'Bye'],
        subs: ['You'],
      })
    ).toEqual('HiYouBye')
  })

  it('Converts an object value to JSON format', () => {
    expect(
      stringify(
        {
          strings: ['Hi', 'Bye'],
          subs: [
            {
              foo: 'bar',
            },
          ],
        },
        {
          json: true,
        }
      )
    ).toEqual('Hi{"foo":"bar"}Bye')
  })

  it('Converts an array value to JSON format', () => {
    expect(
      stringify(
        {
          strings: ['Hi', 'Bye'],
          subs: [[1, 2, 3]],
        },
        {
          json: true,
        }
      )
    ).toEqual('Hi[1,2,3]Bye')
  })
})
