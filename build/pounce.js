// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "pounce", "symbols": ["programList"], "postprocess": (pl) => {
           return {pounce : pl[0].filter(i => i !== null) };
        } },
    {"name": "programList", "symbols": ["optS"]},
    {"name": "programList$ebnf$1", "symbols": []},
    {"name": "programList$ebnf$1", "symbols": ["programList$ebnf$1", "anotherWord"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "programList", "symbols": ["optS", "word", "programList$ebnf$1", "optS"], "postprocess":  ([_, f, r]) => {
        //let debug_rest = "a";
        let rest = r.map(ele => {
            if (ele.length && typeof ele !== 'string') {
                return ele[0];
            }
            return ele;
        });
        // if (rest.length && rest[0].length) {
        // //    debug_rest = "b";
        //     rest = r.map(ele => ele[0]);
        // }
        if (f && f.length) {
            if (f[0].length) {
                return [...f[0], ...rest];
            }
            return [...f, ...rest];
        } 
        return [f, ...rest];
        } },
    {"name": "optS$ebnf$1", "symbols": []},
    {"name": "optS$ebnf$1", "symbols": ["optS$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "optS", "symbols": ["optS$ebnf$1"], "postprocess": () => null},
    {"name": "reqS$ebnf$1", "symbols": [{"literal":" "}]},
    {"name": "reqS$ebnf$1", "symbols": ["reqS$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "reqS", "symbols": ["reqS$ebnf$1"], "postprocess": () => null},
    {"name": "word", "symbols": ["number"]},
    {"name": "word", "symbols": ["string"]},
    {"name": "word", "symbols": ["list"], "postprocess":  ([word]) => {
            if (typeof word === 'string') {
                return word;
            }
            if (word.list) {
                return [[word.list]];
            }
            return word[0];
        } },
    {"name": "anotherWord", "symbols": ["reqS", "word"], "postprocess":  ([_, terms]) => {
            if (terms && terms.length) {
                return terms[0];
            }
            if (terms && terms.list) {
                return terms;
            }
            return {anotherWord: "unexpected", terms}
        } },
    {"name": "list", "symbols": [{"literal":"["}, "programList", {"literal":"]"}], "postprocess":  ([_, items]) => {
            const list = items.filter(i => i !== null);
            if (list && list.length) {
                if (list[0].length) {
                    const head = list.shift();
                    return {list: [head[0], ...list]};
                }
                return {list};
            }
            return {list}
        } },
    {"name": "string", "symbols": ["plainStr"]},
    {"name": "string", "symbols": ["singleQuoteStr"]},
    {"name": "string", "symbols": ["doubleQuoteStr"]},
    {"name": "plainStr$ebnf$1", "symbols": [/[a-zA-Z\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:]/]},
    {"name": "plainStr$ebnf$1", "symbols": ["plainStr$ebnf$1", /[a-zA-Z\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "plainStr", "symbols": ["plainStr$ebnf$1"], "postprocess": ([e]) => ( `${e.join("")}` )},
    {"name": "singleQuoteStr$ebnf$1", "symbols": []},
    {"name": "singleQuoteStr$ebnf$1$subexpression$1", "symbols": [/[\sa-zA-Z0-9\"\`\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:]/]},
    {"name": "singleQuoteStr$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singleQuoteStr$ebnf$1$subexpression$1", "symbols": ["singleQuoteStr$ebnf$1$subexpression$1$string$1"]},
    {"name": "singleQuoteStr$ebnf$1", "symbols": ["singleQuoteStr$ebnf$1", "singleQuoteStr$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "singleQuoteStr", "symbols": [{"literal":"'"}, "singleQuoteStr$ebnf$1", {"literal":"'"}], "postprocess": ([_, e]) => ( `'${e.join("")}'` )},
    {"name": "doubleQuoteStr$ebnf$1", "symbols": []},
    {"name": "doubleQuoteStr$ebnf$1$subexpression$1", "symbols": [/[\sa-zA-Z0-9\'\`\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:]/]},
    {"name": "doubleQuoteStr$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "doubleQuoteStr$ebnf$1$subexpression$1", "symbols": ["doubleQuoteStr$ebnf$1$subexpression$1$string$1"]},
    {"name": "doubleQuoteStr$ebnf$1", "symbols": ["doubleQuoteStr$ebnf$1", "doubleQuoteStr$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "doubleQuoteStr", "symbols": [{"literal":"\""}, "doubleQuoteStr$ebnf$1", {"literal":"\""}], "postprocess": ([_, e]) => ( `"${e.join("")}"` )},
    {"name": "number", "symbols": ["float1"]},
    {"name": "number", "symbols": ["float2"]},
    {"name": "number", "symbols": ["float3"]},
    {"name": "number", "symbols": ["integer"]},
    {"name": "float1$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "float1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "float1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "float1$ebnf$2", "symbols": ["float1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float1$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "float1$ebnf$3", "symbols": ["float1$ebnf$3", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float1", "symbols": ["float1$ebnf$1", "float1$ebnf$2", {"literal":"."}, "float1$ebnf$3"], "postprocess":  ([minus, integ, dot, metisa]) => {
            return parseFloat(minus? '-': '' + integ.join("") + dot + metisa.join(""));
        } },
    {"name": "float2$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "float2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "float2$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "float2$ebnf$2", "symbols": ["float2$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float2", "symbols": ["float2$ebnf$1", {"literal":"."}, "float2$ebnf$2"], "postprocess":  ([minus, dot, metisa]) => {
            return parseFloat(minus? '-': '' + dot + metisa.join(""));
        } },
    {"name": "float3$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "float3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "float3$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "float3$ebnf$2", "symbols": ["float3$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "float3", "symbols": ["float3$ebnf$1", "float3$ebnf$2", {"literal":"."}], "postprocess":  ([minus, integ, dot]) => {
            return parseFloat(minus? '-': '' + integ.join("") + dot);
        } },
    {"name": "integer$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "integer$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "integer$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "integer$ebnf$2", "symbols": ["integer$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "integer", "symbols": ["integer$ebnf$1", "integer$ebnf$2"], "postprocess":  ([minus, integ]) => {
            return parseInt(minus? '-': '' + integ.join(""));
        } }
]
  , ParserStart: "pounce"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
