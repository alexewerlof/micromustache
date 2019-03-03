const nunjucks = require('nunjucks')

// Mozilla's Nunjucks: nunjucks does not sandbox execution so it is not safe to run user-defined templates or inject user-defined content into template definitions. On the server, you can expose attack vectors for accessing sensitive data and remote code execution. On the client, you can expose cross-site scripting vulnerabilities even for precompiled templates (which can be mitigated with a strong CSP). See this issue for more information.
// link: https://mozilla.github.io/nunjucks/templating.html
const renderer = nunjucks.compile(
  'Hi, My name is {{ name }}! I am {{ age }} years old and live in {{ cities[1] }}. foo is {{ nested.foo }}.'
)

function compiled(obj) {
  return renderer.render(obj)
}

module.exports = {
  name: 'Mozilla Nunjucks',
  csp: false,
  cases: [compiled]
}
