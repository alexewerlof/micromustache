const { tokenize, stringify } = require('../')

function delayedResolver(path) {
  return new Promise((resolve) => {
    const start = Date.now()
    setTimeout(() => {
      const duration = Date.now() - start
      resolve(`${path.toUpperCase()} (${duration}ms)`)
    }, 1000)
  })
}

;(async () => {
  try {
    const tokens = await tokenize(
      'I like {{apples}} and {{oranges}} because {{wood}} does not taste good'
    )
    const values = await Promise.all(tokens.paths.map(delayedResolver))
    const result = stringify(tokens.strings, values)
    console.log(result)
    // I like APPLES (1002ms) and ORANGES (1003ms) because WOOD (1003ms) does not taste good
  } catch (e) {
    console.error(e)
  }
})()
