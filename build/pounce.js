// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "pounce$ebnf$1", "symbols": ["value"], "postprocess": id},
    {"name": "pounce$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pounce", "symbols": ["optS", "pounce$ebnf$1", "optValue2", "optS"]},
    {"name": "optS$ebnf$1", "symbols": []},
    {"name": "optS$ebnf$1", "symbols": ["optS$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "optS", "symbols": ["optS$ebnf$1"], "postprocess": () => null},
    {"name": "reqS", "symbols": [{"literal":" "}], "postprocess": () => null},
    {"name": "value", "symbols": ["number"]},
    {"name": "value", "symbols": ["word"]},
    {"name": "value", "symbols": ["list"], "postprocess": (item) => item[0]},
    {"name": "optValue2$ebnf$1", "symbols": []},
    {"name": "optValue2$ebnf$1$subexpression$1", "symbols": ["reqS", "optS", "value", "optS"]},
    {"name": "optValue2$ebnf$1", "symbols": ["optValue2$ebnf$1", "optValue2$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "optValue2", "symbols": ["optValue2$ebnf$1"], "postprocess": (terms) => terms[0].map((e) => (e))},
    {"name": "list", "symbols": [{"literal":"["}, "pounce", {"literal":"]"}], "postprocess": ([a, item, b]) => ({list:[...item]})},
    {"name": "word", "symbols": [{"literal":"a"}]},
    {"name": "number", "symbols": [{"literal":"5"}]}
]
  , ParserStart: "pounce"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
