var Mustache = require('mustache');
var micromustache = require('../src/micromustache.js');

//do not touch non-string template
exports.testNonStringTemplate = function (test) {
    test.deepEqual(micromustache.render(1), 1);
    test.deepEqual(micromustache.render(null, {}), null);
    test.deepEqual(micromustache.render(true, {}), true);
    test.done();
};

//empty string
exports.testEmptyString = function (test) {
    test.deepEqual(micromustache.render('', {}), '');
    test.done();
};

//no keys
exports.testNoKeys = function (test) {
    test.deepEqual(micromustache.render('{{i}}', {}), '');
    test.done();
};

//non existing key
exports.testNonExistingKey = function (test) {
    test.deepEqual(micromustache.render('{{i}}', {j: 1}), '');
    test.done();
};

//Replace only one variable
exports.testReplaceOnlyOneVariable = function (test) {
    test.deepEqual(micromustache.render('{{i}}', {i: 'hello'}), 'hello');
    test.deepEqual(micromustache.render('{{i}} world', {i: 'hello'}), 'hello world');
    test.deepEqual(micromustache.render('Ohoy! {{i}}', {i: 'hello'}), 'Ohoy! hello');
    test.deepEqual(micromustache.render('Ohoy! {{i}} world', {i: 'hello'}), 'Ohoy! hello world');
    test.done();
};

//Replace two variables
exports.testReplaceTwoVariables = function (test) {
    test.deepEqual(micromustache.render('{{i}}{{j}}', {i: 'hello', j: 'world'}), 'helloworld');
    test.deepEqual(micromustache.render('{{i}} {{j}}', {i: 'hello', j: 'world'}), 'hello world');
    test.deepEqual(micromustache.render('{{i}} {{j}} {{k}}', {i: 'hello', j: 'world'}), 'hello world ');
    test.deepEqual(micromustache.render('{{var1}} {{var2}}', {var1: 'hello', var2: 'world'}), 'hello world');
    test.done();
};

//An empty dictionary will just remove all variables
exports.testEmptyObject = function (test) {
    test.deepEqual(micromustache.render('{{i}}'), '');
    test.deepEqual(micromustache.render('{{i}}{{j}}'), '');
    test.deepEqual(micromustache.render('{{i}} {{j}}'), ' ');
    test.deepEqual(micromustache.render(' {{abc}} {{def}} '), '   ');
    test.done();
};

//Using special characters with dollar sign
exports.testSpecialCharacters = function (test) {
    test.deepEqual(micromustache.render('{{a}}', {a: '$'}), '$');
    test.deepEqual(micromustache.render('{{a}}', {a: ' $'}), ' $');
    test.deepEqual(micromustache.render('{{a}}', {a: '$ '}), '$ ');
    test.deepEqual(micromustache.render('{{a}}', {a: '$$'}), '$$');
    test.deepEqual(micromustache.render('{{a}}', {a: '$&'}), '$&');
    test.deepEqual(micromustache.render('{{a}}', {a: '$`'}), '$`');
    test.deepEqual(micromustache.render('{{a}}', {a: '$\''}), '$\'');
    test.deepEqual(micromustache.render('{{a}}', {a: '$1'}), '$1');
    test.done();
};

//Call the value function
exports.testValueFunction = function (test) {
    test.deepEqual(micromustache.render('{{a}}', {
        a: function () {
            return 'world';
        }
    }), 'world');
    test.deepEqual(micromustache.render('{{var1}}', {
        var1: function (key) {
            return key.toLocaleUpperCase();
        }
    }), 'VAR1');
    test.done();
};

//Value is number, boolean
exports.testValueNumberBoolean = function (test) {
    test.deepEqual(micromustache.render('{{a}}', {a: true}), 'true');
    test.deepEqual(micromustache.render('{{a}}', {a: false}), 'false');
    test.deepEqual(micromustache.render('{{a}}', {a: 0}), '0');
    test.deepEqual(micromustache.render('{{a}}', {a: 1}), '1');
    test.deepEqual(micromustache.render('{{a}}', {a: 999}), '999');
    test.deepEqual(micromustache.render('{{a}}', {a: Number.NaN}), 'NaN');
    test.done();
};

//Value is object or null
exports.testValueObjectNull = function (test) {
    test.deepEqual(micromustache.render('a{{b}}c', {
        b: null
    }), 'ac');
    test.deepEqual(micromustache.render('a{{b}}c', {
        b: {}
    }), 'ac');
    test.deepEqual(micromustache.render('a{{b}}c', {
        b: {
            b: 'hi'
        }
    }), 'ac');
    test.done();
};

//More than one occurrence
exports.testValueReoccurance = function (test) {
    test.deepEqual(micromustache.render('{{a}}{{a}}{{a}}', {'a': 'hello'}), 'hellohellohello');
    test.deepEqual(micromustache.render('{{a}}{{b}}{{a}}{{b}}', {'a': '1','b':'2'}), '1212');
    test.done();
};

//Compile a template
exports.testCompile = function (test) {
    var compiled = micromustache.compile('Hello {{name}}!');
    test.deepEqual(typeof compiled, 'function');
    test.deepEqual(compiled({name: 'Alex'}), 'Hello Alex!');
    test.deepEqual(compiled({family: 'Alex'}), 'Hello !');
    test.done();
};

//Compile an empty string
exports.testCompileEmpty = function (test) {
    var compile = micromustache.compile('');
    test.deepEqual(typeof compile, 'function');
    test.deepEqual(compile({a: 2}), '');
    test.done();
};

//Check the existence of the supported functions
exports.testCheckFunction = function (test) {
    test.deepEqual(typeof micromustache, typeof Mustache);

    test.deepEqual(typeof micromustache.render, typeof Mustache.render);

    test.deepEqual(typeof micromustache.render('',{}), typeof Mustache.render('',{}));
    test.done();
};

//Access array elements
exports.testArray = function (test) {
    test.deepEqual(micromustache.render('I like {{0}}, {{1}} and {{2}}',[ "orange", "apple", "lemon" ]),'I like orange, apple and lemon');
    test.done();
};

//Test render() for behaving the same in micromustache
exports.testRender = function (test) {
    var testCases = [
        {
            template:'',
            data:{}
        },
        {
            template:'{{a}}',
            data:{a:''}
        },
        {
            template:'{{a}}',
            data:{a:'1'}
        },
        {
            template:'{{a}}',
            data:{a:'a'}
        },
        {
            template:'{{a}}',
            data:{a:'11'}
        },
        {
            template:'{{a}}',
            data:{a:' '}
        },
        {
            template:' {{a}} ',
            data:{a:''}
        },
        {
            template:' {{a}} ',
            data:{a:' '}
        },
        {
            template:' {{a}} {{b}} ',
            data:{a:' '}
        },
        {
            template:' {{a}} {{b}} ',
            data:{a:'a',b:'b'}
        },
        {
            template:' {{a}} {{a}} {{a}}',
            data:{a:'a'}
        },
        {
            template:' {{a}} {{a}} {{a}}',
            data:{a:'-'}
        },
        {
            template:'{{1}}',
            data:{'1':'-'}
        },
        {
            template:'{{}}',
            data:{'':'hello'}
        },
        {
            template:'{{ }}',
            data:{' ':'-'}
        },
        {
            template:'{{-}}',
            data:{'-':'-'}
        },
        {
            template:'{{1a}}',
            data:{'1a':'-'}
        },
        {
            template:'{{a}}',
            data:{a:null}
        },
        {
            template:'{{a}},{{b}}',
            data:{a:123,b:null}
        },
        {
            template:'{{a}}',
            data:null
        },
        {
            template:'{{a}}',
            data:{}
        },
        {
            template:'{{a}}',
            data:{a:true}
        },
        {
            template:'{{a}}',
            data:{a:false}
        },
        {
            template:'{{a}}',
            data:{a:Math.NaN}
        },
        {
            template:'{{a}}',
            data:{a:Number.POSITIVE_INFINITY}
        },
        {
            template:'{{a}}',
            data:{a:Number.NEGATIVE_INFINITY}
        },
        {
            template:'{{a}}',
            data:{a:0}
        },
        {
            template:'{{a}}',
            data:{a:0.1}
        },
        {
            template:'{{a}}',
            data:{a:0.00001}
        },
        {
            template:'{{$}}',
            data:{'$':'test'}
        },
        {
            template:'{{_}}',
            data:{'_':'test'}
        },
        {
            template:'{{    }}',
            data:{'_':'test'}
        },
        {
            template:'{{   a}}',
            data:{'a':'test'}
        },
        {
            template:'{{a   }}',
            data:{'a':'test'}
        },
        {
            template:'{{   a   }}',
            data:{'a':'test'}
        },
        {
            template:'{{%}}',
            data:{'%':'test'}
        },
        {
            template:'{{var}}',
            data:{'var':'test'}
        },
        {
            template:'{{{var}}}',
            data:{'var':'test'}
        },
        {
            template:'{{{{var}}}}',
            data:{'var':'test'}
        },
        {
            template:'{{a{{b}}c}}',
            data:{'a':'a','b':'b','c':'c'}
        },
        {
            template:'I like {{0}}, {{1}} and {{2}}',
            data:[ "orange", "apple", "lemon" ]
        }
    ];
    for (var i = 0; i < testCases.length; i++) {
        var testCase = testCases[i];
        var template = testCase.template;
        var data = testCase.data;
        test.deepEqual(micromustache.render(template,data), Mustache.render(template,data),'Template: ' + template + ', data: ' + JSON.stringify(data) );
    }
    test.done();
};


// function args 
exports.testFunctionArgs = function (test) {
    test.deepEqual(micromustache.render('{{foo:one:two}}', {
      foo: function(){
        return JSON.stringify(arguments);
      }
    }), '{"0":"foo","1":"one","2":"two"}');
    test.done();
};
