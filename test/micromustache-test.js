test('do not touch non-string template', function () {
    deepEqual(micromustache.render(1), 1);
    deepEqual(micromustache.render(null, {}), null);
    deepEqual(micromustache.render(true, {}), true);
});

test('empty string', function () {
    deepEqual(micromustache.render('', {}), '');
});

test('no keys', function () {
    deepEqual(micromustache.render('{{i}}', {}), '');
});

test('non existing key', function () {
    deepEqual(micromustache.render('{{i}}', {j: 1}), '');
});

test('Replace only one variable', function () {
    deepEqual(micromustache.render('{{i}}', {i: 'hello'}), 'hello');
    deepEqual(micromustache.render('{{i}} world', {i: 'hello'}), 'hello world');
    deepEqual(micromustache.render('Ohoy! {{i}}', {i: 'hello'}), 'Ohoy! hello');
    deepEqual(micromustache.render('Ohoy! {{i}} world', {i: 'hello'}), 'Ohoy! hello world');
});

test('Replace two variables', function () {
    deepEqual(micromustache.render('{{i}}{{j}}', {i: 'hello', j: 'world'}), 'helloworld');
    deepEqual(micromustache.render('{{i}} {{j}}', {i: 'hello', j: 'world'}), 'hello world');
    deepEqual(micromustache.render('{{i}} {{j}} {{k}}', {i: 'hello', j: 'world'}), 'hello world ');
    deepEqual(micromustache.render('{{var1}} {{var2}}', {var1: 'hello', var2: 'world'}), 'hello world');
});

test('An empty dictionary will just remove all variables', function () {
    deepEqual(micromustache.render('{{i}}'), '');
    deepEqual(micromustache.render('{{i}}{{j}}'), '');
    deepEqual(micromustache.render('{{i}} {{j}}'), ' ');
    deepEqual(micromustache.render(' {{abc}} {{def}} '), '   ');
});

test('Using special characters with dollar sign', function () {
    deepEqual(micromustache.render('{{a}}', {a: '$'}), '$');
    deepEqual(micromustache.render('{{a}}', {a: ' $'}), ' $');
    deepEqual(micromustache.render('{{a}}', {a: '$ '}), '$ ');
    deepEqual(micromustache.render('{{a}}', {a: '$$'}), '$$');
    deepEqual(micromustache.render('{{a}}', {a: '$&'}), '$&');
    deepEqual(micromustache.render('{{a}}', {a: '$`'}), '$`');
    deepEqual(micromustache.render('{{a}}', {a: '$\''}), '$\'');
    deepEqual(micromustache.render('{{a}}', {a: '$1'}), '$1');
});

test('Call the value function', function () {
    deepEqual(micromustache.render('{{a}}', {
        a: function () {
            return 'world';
        }
    }), 'world');
    deepEqual(micromustache.render('{{var1}}', {
        var1: function (key) {
            return key.toLocaleUpperCase();
        }
    }), 'VAR1');
});

test('Value is number, boolean', function () {
    deepEqual(micromustache.render('{{a}}', {a: true}), 'true');
    deepEqual(micromustache.render('{{a}}', {a: false}), 'false');
    deepEqual(micromustache.render('{{a}}', {a: 0}), '0');
    deepEqual(micromustache.render('{{a}}', {a: 1}), '1');
    deepEqual(micromustache.render('{{a}}', {a: 999}), '999');
    deepEqual(micromustache.render('{{a}}', {a: Number.NaN}), 'NaN');
});

test('Value is object or null', function () {
    deepEqual(micromustache.render('a{{b}}c', {
        b: null
    }), 'ac');
    deepEqual(micromustache.render('a{{b}}c', {
        b: {}
    }), 'ac');
    deepEqual(micromustache.render('a{{b}}c', {
        b: {
            b: 'hi'
        }
    }), 'ac');
});

test('More than one occurance', function () {
    deepEqual(micromustache.render('{{a}}{{a}}{{a}}', {'a': 'hello'}), 'hellohellohello');
    deepEqual(micromustache.render('{{a}}{{b}}{{a}}{{b}}', {'a': '1','b':'2'}), '1212');
});

test('Compile a template', function () {
    var compiled = micromustache.compile('Hello {{name}}!');
    deepEqual(typeof compiled, 'function');
    deepEqual(compiled({name: 'Alex'}), 'Hello Alex!');
    deepEqual(compiled({family: 'Alex'}), 'Hello !');
});

test('Compile an empty string', function () {
    compiled = micromustache.compile('');
    deepEqual(typeof compiled, 'function');
    deepEqual(compiled({a: 2}), '');
});

test('Check the existence of the supported functions', function () {
    deepEqual(typeof micromustache, typeof Mustache);

    deepEqual(typeof micromustache.render, typeof Mustache.render);

    deepEqual(typeof micromustache.render('',{}), typeof Mustache.render('',{}));
});

test('Access array elements', function () {
    deepEqual(micromustache.render('I like {{0}}, {{1}} and {{2}}',[ "orange", "apple", "lemon" ]),'I like orange, apple and lemon');
});

test('Test render() for behaving the same in micromustache', function () {
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
        deepEqual(micromustache.render(template,data), Mustache.render(template,data),'Template: ' + template + ', data: ' + JSON.stringify(data) );
    }
});