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
    console.log('.');
    while (s_len > i && s[i] !== '\n') {
        i += 1;
    } 
    return [s.slice(i), ast];
}
const pushList = (s, ast) => {
    const [s2, sub_ast] = parseAux(s.slice(1), []);
    ast.push(sub_ast);
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
    // ['"', pushDblQtString], 
    // ["'", pushSglQtString], 
];

const parseWord = (s, ast) => {
    
    const regex = /^[^#\s\[\]\"\']+/;
    const found = s.match(regex);
    if (found && found.length ) {
        // console.log(s, found[0]);
        // console.log("ast", ast);
        ast.push(found[0])
        return [s.slice(found[0].length), ast];
    }
    return [s.slice(0), ast];
};

const parseAux = (s, ast) => {
    let s2 = s;
    const nwm_len = nonWordMap.length;
    while (s2.length) {
        console.log(s2);
        let rule_i = 0;
        while(nwm_len > rule_i && s2[0] !== nonWordMap[rule_i][0]) {
            rule_i += 1;
        }
        console.log(rule_i);
        if (nwm_len > rule_i) {
            console.log("apply nonWord rule", "(", nonWordMap[rule_i][0], ")");
            if (s2[0] === "]") {
                // console.log("pop", [s, [...ast]])
                return [s2.slice(1), ast];
            }
            [s2, ast] = nonWordMap[rule_i][1](s2, ast);
        }
        [s2, ast] = parseWord(s2, ast);
    }
    return [s2, ast];
};

console.log(JSON.stringify(parse("a abc def # ghi jk\n abf [a]")));