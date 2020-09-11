(function () {
    function id(x) { return x[0]; }


let escapeStack = [];

const parse = s => {
    let ast = [];
    while (s && s.length) {
        [s, ast] = parseAux(s, ast);
        
    }
    return [s, ast];
};

const consumeOne = (s, ast) => { return [s.slice(1), ast]; };
const consumeComment = (s, ast) => {
    let i = 0;
    const s_len =  s.length;
    while (s_len > i && s[i] !== '\n') {
        i += 1;
    } 
    return [s.slice(i), ast];
}

const pushList = (s, ast) => {
    escapeStack.push("]");
    console.log("get sub-list ast");
    const [s2, sub_ast] = parseAux(s.slice(1), []);
    console.log("got sub-ast", JSON.stringify(sub_ast));
    ast.push(sub_ast);
    return [s2, ast];
}

const pushHash = (s, ast) => {
    escapeStack.push("}");
    const [s2, sub_ast] = parseKVPs(s.slice(1), {});
    ast.push(sub_ast);
    return [s2, ast];
}

const pushInfix = (s, ast) => {
    escapeStack.push(")");
    const [s2, sub_ast] = parseAux(s.slice(1), []);
    ast.push({"_type":"infix", "infix": sub_ast});
    return [s2, ast];
}

const pushType = (s, ast) => {
    escapeStack.push(">");
    const [s2, sub_ast] = parseAux(s.slice(1), []);
    ast.push({"_type":"type", "type": sub_ast});
    return [s2, ast];
}

const pushString = (s, ast) => {
    const delim = s[0];
    escapeStack.push(delim);
    const [s2, sub_string] = parseString(s.slice(1), delim);
    ast.push(sub_string);
    return [s2, ast];
}


const nonWordMap = [
    ['#', consumeComment],
    [' ', consumeOne], 
    ['\n', consumeOne], 
    ['\t', consumeOne], 
    ['\r', consumeOne], 
    ['[', pushList], 
    [']', null], 
    ['{', pushHash], 
    ['}', null], 
    ['(', pushInfix], 
    [')', null], 
    ['<', pushType], 
    ['>', null], 
    ['"', pushString], 
    ["'", pushString], 
    ["`", pushString], 
];

const parseString = (s, delim) => {    
    let i = 0;
    let esc = false;
    s.length
    while (s.length > i && (esc || s[i] !== delim) ) {
        esc = false;
        console.log('*** s[i] ***', JSON.stringify(s[i]));
        if (s[i] === '\\') {
            console.log("hi back slash");
            esc = true;
        }
        i += 1;
    }
    
    found = s.slice(0, i);
    console.log('*** found ***', JSON.stringify(found));
    if (i) {
        return [s.slice(i), delim+found+delim];
    }
    return [s, delim+delim];
};

const parseWord = (s, ast) => {
    
    const regex = /^[^#\s\[\]\"\'\`\{\}]+/;
    const found = s.match(regex);
    if (found && found.length ) {
        console.log("parseWord found ", JSON.stringify(s), JSON.stringify(found[0]));
        ast.push(found[0])
        console.log("parseWord post ast", ast);
        return [s.slice(found[0].length), ast];
    }
    return [s.slice(0), ast];
};

const parseKVPs = (s, ast) => {
    // TBD
    return [s.slice(1), ast];
};


const parseAux = (s, ast) => {
    let s2 = s;
    let ast2 = [...ast];
    const nwm_len = nonWordMap.length;
    while (s2.length) {
        let rule_i = 0;
        while(rule_i < nwm_len && s2[0] !== nonWordMap[rule_i][0]) {
            rule_i += 1;
        }
        if (rule_i < nwm_len) {
            console.log("apply nonWord rule", "(", nonWordMap[rule_i][0], ")");
            if (s2[0] === escapeStack[escapeStack.length-1] && nonWordMap[rule_i][1] === null) {
                
                console.log("pop", [s2, [...escapeStack]]);
                const popped = escapeStack.pop();
                if (popped === ']') {
                    return [s2.slice(1), ast2];
                }
                else {
                    console.log('*** tick ***');
                    s2 = s2.slice(1);
                    // return [s2.slice(1), ast2];
                }
            }
            else {
                [s2, ast2] = nonWordMap[rule_i][1](s2, ast2);
            }
        }
        else {
            console.log("pre parseWord for ", s2, JSON.stringify(ast2));
            [s2, ast2] = parseWord(s2, ast2);
            console.log("post parseWord for ", s2, JSON.stringify(ast2));
        }
    }
    return [s2, ast2];
};

// console.log(JSON.stringify(parse("a abc def # ghi jk\n abf [a]")));






// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley

var pouncer = parse;


if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
    module.exports = pouncer;
} else {
    window.pouncer = pouncer;
}
})();

