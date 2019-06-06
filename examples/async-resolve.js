const fetch = require('node-fetch')
const { renderFnAsync } = require('../dist/node')
const am = require('am')
am(async () => {
  try {
    const result = await renderFnAsync(
      'The first todo title is {{1}}',
      async function (taskId) {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/' + taskId
        )
        const taskData = await response.json()
        return taskData.title
      }
    )
    console.log(result)
  } catch (e) {
    console.error(e)
  }
})
