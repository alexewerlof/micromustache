test('do not touch non-string template', function () {
    deepEqual(MicroMustache.render(1), 1);
    deepEqual(MicroMustache.render(null, {}), null);
    deepEqual(MicroMustache.render(true, {}), true);
});

test('empty string', function () {
    deepEqual(MicroMustache.render('', {}), '');
});

test('no keys', function () {
    deepEqual(MicroMustache.render('{{i}}', {}), '');
});

test('non existing key', function () {
    deepEqual(MicroMustache.render('{{i}}', {j: 1}), '');
});

test('Replace only one variable', function () {
    deepEqual(MicroMustache.render('{{i}}', {i: 'hello'}), 'hello');
    deepEqual(MicroMustache.render('{{i}} world', {i: 'hello'}), 'hello world');
    deepEqual(MicroMustache.render('Ohoy! {{i}}', {i: 'hello'}), 'Ohoy! hello');
    deepEqual(MicroMustache.render('Ohoy! {{i}} world', {i: 'hello'}), 'Ohoy! hello world');
});

test('Replace two variables', function () {
    deepEqual(MicroMustache.render('{{i}}{{j}}', {i: 'hello', j: 'world'}), 'helloworld');
    deepEqual(MicroMustache.render('{{i}} {{j}}', {i: 'hello', j: 'world'}), 'hello world');
    deepEqual(MicroMustache.render('{{i}} {{j}} {{k}}', {i: 'hello', j: 'world'}), 'hello world ');
    deepEqual(MicroMustache.render('{{var1}} {{var2}}', {var1: 'hello', var2: 'world'}), 'hello world');
});

test('An empty dictionary will just remove all variables', function () {
    deepEqual(MicroMustache.render('{{i}}'), '');
    deepEqual(MicroMustache.render('{{i}}{{j}}'), '');
    deepEqual(MicroMustache.render('{{i}} {{j}}'), ' ');
    deepEqual(MicroMustache.render(' {{abc}} {{def}} '), '   ');
});

test('Using special characters with dollar sign', function () {
    deepEqual(MicroMustache.render('{{a}}', {a: '$'}), '$');
    deepEqual(MicroMustache.render('{{a}}', {a: ' $'}), ' $');
    deepEqual(MicroMustache.render('{{a}}', {a: '$ '}), '$ ');
    deepEqual(MicroMustache.render('{{a}}', {a: '$$'}), '$$');
    deepEqual(MicroMustache.render('{{a}}', {a: '$&'}), '$&');
    deepEqual(MicroMustache.render('{{a}}', {a: '$`'}), '$`');
    deepEqual(MicroMustache.render('{{a}}', {a: '$\''}), '$\'');
    deepEqual(MicroMustache.render('{{a}}', {a: '$1'}), '$1');
});

test('Call the value function', function () {
    deepEqual(MicroMustache.render('{{a}}', {
        a: function () {
            return 'world';
        }
    }), 'world');
    deepEqual(MicroMustache.render('{{var1}}', {
        var1: function (key) {
            return key.toLocaleUpperCase();
        }
    }), 'VAR1');
});

test('Value is number, boolean', function () {
    deepEqual(MicroMustache.render('{{a}}', {a: true}), 'true');
    deepEqual(MicroMustache.render('{{a}}', {a: false}), 'false');
    deepEqual(MicroMustache.render('{{a}}', {a: 0}), '0');
    deepEqual(MicroMustache.render('{{a}}', {a: 1}), '1');
    deepEqual(MicroMustache.render('{{a}}', {a: 999}), '999');
    deepEqual(MicroMustache.render('{{a}}', {a: Number.NaN}), 'NaN');
});

test('Value is object or null', function () {
    deepEqual(MicroMustache.render('a{{b}}c', {
        b: null
    }), 'ac');
    deepEqual(MicroMustache.render('a{{b}}c', {
        b: {}
    }), 'ac');
    deepEqual(MicroMustache.render('a{{b}}c', {
        b: {
            b: 'hi'
        }
    }), 'ac');
});

test('More than one occurance', function () {
    deepEqual(MicroMustache.render('{{a}}{{a}}{{a}}', {'a': 'hello'}), 'hellohellohello');
    deepEqual(MicroMustache.render('{{a}}{{b}}{{a}}{{b}}', {'a': '1','b':'2'}), '1212');
});

test('Compile a template', function () {
    var compiled = MicroMustache.compile('Hello {{name}}!');
    deepEqual(typeof compiled, 'function');
    deepEqual(compiled({name: 'Alex'}), 'Hello Alex!');
    deepEqual(compiled({family: 'Alex'}), 'Hello !');
});

test('Compile an empty string', function () {
    compiled = MicroMustache.compile('');
    deepEqual(typeof compiled, 'function');
    deepEqual(compiled({a: 2}), '');
});

test('Check the existence of the supported functions', function () {
    deepEqual(typeof MicroMustache, typeof Mustache);

    deepEqual(typeof MicroMustache.render, typeof Mustache.render);

    deepEqual(typeof MicroMustache.render('',{}), typeof Mustache.render('',{}));
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
    ];
    for (var i = 0; i < testCases.length; i++) {
        var testCase = testCases[i];
        var template = testCase.template;
        var data = testCase.data;
        deepEqual(MicroMustache.render(template,data), Mustache.render(template,data),'Template: ' + template + ', data: ' + data );
    }
});