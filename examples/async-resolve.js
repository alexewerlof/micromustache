const { parse, stringify } = require('../')

// Just waits a sec and returns the path in uppercase
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
    const parsedTemplate = await parse(
      'I like {{apples}} and {{oranges}} because {{wood}} does not taste good'
    )
    const modifiedTemplate = {
      strings: parsedTemplate.strings,
      subs: await Promise.all(parsedTemplate.subs.map(delayedResolver)),
    }
    console.log(stringify(modifiedTemplate))
    // I like APPLES (1002ms) and ORANGES (1003ms) because WOOD (1003ms) does not taste good
  } catch (e) {
    console.error(e)
  }
})()
