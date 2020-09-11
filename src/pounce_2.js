(function () {
    function id(x) { return x[0]; }




const parse = s => {
    let ast = [];
    return parseAux(s, ast);
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

const pushList = (s, ast, delim) => {
    // escapeStack.push(delim);
    console.log("get sub-list ast");
    const [s2, sub_ast] = parseAux(s.slice(1), [], delim);
    console.log("got sub-ast", JSON.stringify(sub_ast));
    return [s2, [...ast, sub_ast]];
}

const pushHash = (s, ast, delim) => {
    // escapeStack.push(delim);
    const [s2, sub_ast] = parseKVPs(s.slice(1), {}, delim);
    return [s2, [...ast, sub_ast]];
}

const pushInfix = (s, ast, delim) => {
    //escapeStack.push(")");
    const [s2, sub_ast] = parseAux(s.slice(1), [], delim);
    ast.push({"_type":"infix", "infix": sub_ast});
    return [s2, ast];
}

const pushType = (s, ast, delim) => {
    // escapeStack.push(">");
    const [s2, sub_ast] = parseAux(s.slice(1), [], delim);
    ast.push({"_type":"type", "type": sub_ast});
    return [s2, ast];
}

const pushString = (s, ast, delim) => {
    //escapeStack.push(delim);
    const [s2, sub_string] = parseString(s.slice(1), delim);
    const s3 = s2[0] === delim? s2.slice(1): s2.slice(0);
    return [s3, [...ast, sub_string]];
}


const nonWordMap = [
    ['#', consumeComment],
    [' ', consumeOne], 
    ['\n', consumeOne], 
    ['\t', consumeOne], 
    ['\r', consumeOne], 
    ['[', pushList,  ']'], 
    ['{', pushHash,  '}'], 
    ['(', pushInfix, ')'], 
    ['<', pushType,  '>'], 
    ['"', pushString, '"'], 
    ["'", pushString, "'"], 
    ["`", pushString, "`"], 
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
    console.log('*** found ***', JSON.stringify(found), i, JSON.stringify(s.slice(i+1)));
    if (i) {
        return [s.slice(i), delim+found+delim];
    }
    return [s.slice(1), delim+delim];
};

const parseWord = (s, ast) => {
    
    const regex = /^[^#\s\[\]]+/;
    const found = s.match(regex);
    if (found && found.length ) {
        console.log("parseWord found ", JSON.stringify(s), JSON.stringify(found[0]));
        ast.push(found[0])
        console.log("parseWord post ast", ast);
        return [s.slice(found[0].length), ast];
    }
    return [s.slice(1), ast];
};

const parseKVPs = (s, ast) => {
    // TBD
    return [s.slice(1), ast];
};


const parseAux = (s, ast, delim) => {
    let s2;
    let ast2;
    const nwm_len = nonWordMap.length;
    let rule_i = 0;
    while(rule_i < nwm_len && s[0] !== nonWordMap[rule_i][0]) {
        rule_i += 1;
    }
    if (rule_i < nwm_len) {
        console.log("apply nonWord rule", "(", nonWordMap[rule_i][0], ")");
        [s2, ast2] = nonWordMap[rule_i][1](s, ast, nonWordMap[rule_i][2]);
        console.log("post apply nonWord ", s, JSON.stringify(ast));
    }
    else {
        console.log("pre parseWord for ", s, JSON.stringify(ast));
        [s2, ast2] = parseWord(s, ast);
        console.log("post parseWord for ", s, JSON.stringify(ast));
    }
    if (s2.length) {
        const s3 = s2[0] === delim? s2.slice(1): s2;
        return parseAux(s2, ast2);
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

