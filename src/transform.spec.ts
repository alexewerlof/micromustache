import { transform, transformAsync } from './transform'
import { ParsedTemplate } from './parse'
import { setTimeout } from 'timers'
import { promisify } from 'util'

/**
 * The promise version of setTimeout()
 * @see https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args
 */
const setTimeoutP = promisify(setTimeout)

describe('transform()', () => {
  it('applies the transformation to the parsedTemplate', () => {
    const parsedTemplate: ParsedTemplate<string> = {
      strings: ['A', 'C', 'E'],
      subs: ['B', 'D'],
    }
    expect(transform(parsedTemplate, (path, index) => `${path.toLowerCase()}-${index}`)).toEqual({
      strings: ['A', 'C', 'E'],
      subs: ['b-0', 'd-1'],
    })
  })
})

describe('transformAsync()', () => {
  it('applies the transformation to the parsedTemplate', async () => {
    const parsedTemplate: ParsedTemplate<string> = {
      strings: ['A', 'C', 'E'],
      subs: ['B', 'D'],
    }
    expect(
      await transformAsync(
        parsedTemplate,
        async (path, index) => await setTimeoutP(200, `${path.toLowerCase()}-${index}`)
      )
    ).toEqual({
      strings: ['A', 'C', 'E'],
      subs: ['b-0', 'd-1'],
    })
  })
})
