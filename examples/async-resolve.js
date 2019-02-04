const https = require('https')
const { renderAsync } = require('../lib/render')

// Run it with `node -r ts-node/register examples/async-resolve.js`

// from https://nodejs.org/api/http.html#http_http_get_url_options_callback
function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            'Invalid content-type.\n' + `Expected application/json but received ${contentType}`
          )
        }
        if (error) {
          console.error(error.message)
          // consume response data to free up memory
          res.resume()
          return reject(error)
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', chunk => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject(e.message)
          }
        })
      })
      .on('error', e => {
        reject(e.message)
      })
  })
}

/*
https://od-api-demo.oxforddictionaries.com:443/api/v1/domains/{source_domains_language}/{target_domains_language}
*/
// TODO that empty object is dumb
renderAsync(
  'The first todo title is {{1}}',
  {},
  {
    resolver: async function(taskId) {
      const taskData = await fetch('https://jsonplaceholder.typicode.com/todos/' + taskId)
      return taskData.title
    }
  }
).then(console.log, console.error)
