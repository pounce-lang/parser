const pinna = require("../bundle.js");


let parser_tests = [
    [`#abc`, []],
// ];
// let other_parser_tests = [
    [`#abc 
    compose #eee `, ['compose']],
    [`a [+ " ="   m ] z`, ['a', ['+', '" ="', 'm'], 'z']],
    ['hello world', ['hello', 'world']],
    ['helloworld', [ 'helloworld' ]],
    ["'hello world'", [ "'hello world'" ]],
    ['"hello world"', [ '"hello world"' ]],
    ['a b c d', [ 'a', 'b', 'c', 'd' ]],
    ["' '", [ "' '" ]],
    ['" "', [ '" "' ]],
    ["''", [ "''" ]],
    ['""', [ '""' ]],
    ['" " " in the middle " " "', [ '" "', '" in the middle "', '" "' ]],
    ['"\\\""', [ '"\\\""' ]],
    ["'\\\''", [ "'\\\''" ]],
    ['"\'"', [ '"\'"' ]],
    ["'\"'", [ "'\"'" ]],
    ['"A \\"Quote\\" is good" dup', [ '"A \\"Quote\\" is good"', 'dup' ]],
    ['+', ['+']],
    ['"+"', ['"+"']],
    ['4 7 1 9 \'+\' "+" `+`', ['4', '7', '1', '9', "'+'", '"+"', '`+`']],
    ['4 7 1 9 + + + ', ['4', '7', '1', '9', '+', '+', '+']],
    ['4 4 ++', ['4', '4', '++']],
    ['4 4 ++ ++ 7 ++', ['4', '4', '++', '++', '7', '++']],
    ['[+]', [['+']]],
    ['a ["+"] b', ['a', ['"+"'], "b"]],
    ['a ["\\\"+"] b', ['a', ['"\\\"+"'], "b"]],
    ['[m x * b + = m [*] x + b]', 
         [ [ 'm', 'x', '*', 'b', '+', '=', 'm', ['*'], 'x', '+', 'b' ] ]],

         [`
    # y = mx + b
    4 0 .5 [m b x] [m x * b + 
     " =" m "*" x "+ " b 
    ] pounce`, [ "4",
        "0",
        ".5",
        [ 'm', 'b', 'x' ],
        [ 'm', 'x', '*', 'b', '+', '" ="', 'm', '"*"', 'x', '"+ "', 'b' ],
        'pounce' ]],
    [`abc 
    # compose 
    #eee `, ['abc']],
    ['abc compose #eee ', ['abc', 'compose']],
    ['abc compose eee ', ['abc', 'compose', 'eee']],
    [' abc compose  eee ', ['abc', 'compose', 'eee']],
    ['"abc compose" "123 456"', ['"abc compose"', '"123 456"']],
    ['abc "compose" "123 " 456', ['abc', '"compose"', '"123 "', "456"]],
    ['5.5 2.1 + 456', ['5.5', '2.1', '+', '456']],
    ['[5.5 2.1] .456 +', [['5.5', '2.1'], '.456', '+']],
    ['[[5.5 2.1] [1 2 3]] 0.456 +', [[['5.5', '2.1'], ['1', '2', '3']], '0.456', '+']],
    [' [ [5.5 2.1]  [1 2 3] ]  .456  +   ', [[['5.5', '2.1'], ['1', '2', '3']], '.456', '+']],
    ['[["5.5" 2.1] [1 "2" 3]] .456[] +', [[['"5.5"', '2.1'], ['1', '"2"', '3']], '.456', [], '+']],
    [' [ ["5.5" 2.1]  [1 "2" "3 3"] ]    0.456  +   ', [[['"5.5"', '2.1'], ['1', '"2"', '"3 3"']], '0.456', '+']],
    ['[4 5 +] ', [['4', '5', '+']]],
    ['[4 5 +] [4 5 +]', [['4', '5', '+'], ['4', '5', '+']]],
    ['[4 5 +] [4 5 +] [4 5 +]', [['4', '5', '+'], ['4', '5', '+'], ['4', '5', '+']]],
    ['[4 5 +] foo [4 5 +]', [['4', '5', '+'], 'foo', ['4', '5', '+']]],
    ['a [abc]', ['a', ['abc']]],
    ['"1a1"', ['"1a1"']],
    ['1a1', ["1a1"]],
    ['true', [true]],
    ['false', [false]],
    [' true', [true]],
    [' false', [false]],
    ['true ', [true]],
    ['false ', [false]],
    [' true ', [true]],
    [' false ', [false]],
    ['false truer [false] true 1true', [false, 'truer', [false], true, '1true']],
    ['true falser [true] false 2false', [true, 'falser', [true], false, '2false']],
    ['', []]
];

function cmpLists(a, b) {
    let same = true;
    if (a.length === b.length) {
        a.forEach((a_ele, i) => {
            if (a[i] !== b[i]) {
                same = false;
            }
        });
    }
    else {
        same = false;
    }
    return same;
}

console.log('Starting parser tests:');
let testCount = 0;
let testsFailed = 0;
parser_tests.forEach((test, i) => {
    const ps = test[0];
    const expected_pl = test[1];

    // console.log(`starting parse test for: '${ps}'`);
    try {
        const parseResult = pinna.parse(ps);
        if (parseResult.success) {
            const result_pl = parseResult.ast;
            testCount += 1;
            if (!deepCompare(result_pl, expected_pl)) {
                testsFailed += 1;
                console.log(`got this \n${JSON.stringify(result_pl, null, "")} \nbut expected \n${JSON.stringify(expected_pl, null, "")}`);
                console.log('---- Failed parse test for: ', ps);
                parser_tests[i][2] = false;
                parser_tests[i][3] = result_pl;
            }
            else {
                parser_tests[i][2] = true;
            }
        }
        else {
            console.log('---- input failed to parse: ', parseResult);
        }
    }
    catch (e) {
        if (parser_tests[i][1][0] !== "parse error") {
            parser_tests[i][2] = false;
            testsFailed += 1;
            console.log(`Parse error in: '${parser_tests[i][0]}' Exception: ${e}`);
        }
    }
});

if (testsFailed === 0) {
    console.log('All', testCount, 'tests passed.');
}

function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw new Error("Need two or more arguments to compare");
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

// exec(`npx nearley-test build/pounce.js < test/test1.pounce`)
