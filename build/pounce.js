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
    {"name": "programList$ebnf$1", "symbols": ["programList$ebnf$1", "moreWords"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "programList", "symbols": ["optS", "word", "programList$ebnf$1", "optS"], "postprocess":  ([_, f, r]) => {
        if (f && f.length) {
            return [...f, ...r];
        } 
        return [f, ...r];
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
            if(word && word.word) {
                return word;
            }
            return word;
        } },
    {"name": "moreWords", "symbols": ["reqS", "word", "optS"], "postprocess":  ([_, terms]) => {
            if (terms && terms.length) {
                return terms[0];
            }
            if (terms && terms.list) {
                return terms;
            }
            return {moreWords: "unexpected", terms}
        } },
    {"name": "list", "symbols": [{"literal":"["}, "programList", {"literal":"]"}], "postprocess": ([_, items]) => ({list:items.filter(i => i !== null)})},
    {"name": "string$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[a-zA-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": ["string$ebnf$1"], "postprocess": e => ({string: e[0].join("") })},
    {"name": "number$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$3$subexpression$1$ebnf$1", "symbols": ["number$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "number$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "number$ebnf$3", "symbols": ["number$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$ebnf$1", "number$ebnf$2", "number$ebnf$3"], "postprocess":  (a) => {
        	const sign = a[0] ? a[0] : "";
        	const decimal = a[1].join("");
        	const metisa = a[2]? "." + a[2][1] : "";
        	return {number: sign + decimal + metisa };
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
