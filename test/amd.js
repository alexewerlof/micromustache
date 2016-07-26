// Open amd.html in the browser to run this test
var output = document.getElementById('output');
output.innerText = 'RequireJS loaded. Going to use micromustache...';
require(['../browser/micromustache.js'], function (micromustache) {
  output.innerText = micromustache.render('It is {{state}}!', {state: 'working'});
});
