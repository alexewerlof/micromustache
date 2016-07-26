// Please open global.html in a browser to run this test
var output = document.getElementById('output');
output.innerText = 'Loaded. Going to call micromustache...';
output.innerText = micromustache.render('It is {{state}}!', {state: 'working'});
