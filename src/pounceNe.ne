# @{%
# const moo = require("moo");
# 
# const lexer = moo.compile({
#     hashcomment: {
#         match: /#[^\n]*/,
#         value: s => s.substring(1)
#     }});
# %}
# 
# @lexer lexer

## paste into https://omrelli.ug/nearley-playground/

pounce -> programList {% (pl) => {
    return {pounce : pl[0].filter(i => i !== null) };
 } %}
programList -> hashcomment | optS | optS word anotherWord:* optS {% ([_, f, r]) => {
    let rest = r.map(ele => {
        if (ele && ele.length && typeof ele !== 'string') {
            return ele[0];
        }
        return ele;
    });
    if (f && f.length) {
        if (f[0].length) {
            return [...f[0], ...rest];
        }
        return [...f, ...rest];
    } 
    return [f, ...rest];
    } %}

optS -> [\s\n\t]:* {% () => null %}
reqS -> [\s\n\t]:+ {% () => null %}

word -> number | string | list {% ([word]) => {
    if (word === null) {
        return '';
    }
    if (typeof word === 'string') {
        return word;
    }
    if (word.list) {
        return [[word.list]];
    }
    if (word === null) {
        return [];
    }
    return word[0];
} %}
anotherWord -> reqS word {% ([_, terms]) => {
    if (terms && terms.length) {
        return terms[0];
    }
    if (terms && terms.list) {
        return terms;
    }
    return {anotherWord: "unexpected", terms}
} %}

hashcomment -> "#" [^\n]:* {% () => [] %} 

list -> "[" programList "]" {% ([_, items]) => {
    return {list: items};
} %}

string -> plainStr 
    | singleQuoteStr 
    | doubleQuoteStr 

plainStr -> [0-9]:* ([a-zA-Z\~\!\@\$\%\^\&\*\_\=\+\/\\\?\,\<\>\;\:] [0-9\-\.]:* ):+ {% ([pre, nonNum]) => {
    const part2 = nonNum.map(ele => {
        return ele[0] + ele[1].join("");
    });
    return `${pre.join("")}${part2.join("")}`;
} %}

singleQuoteStr -> "'"  ([\sa-zA-Z0-9\"\`\~\!\@\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:] | "\\'"):* "'" {% ([_, e]) => ( `'${e.join("")}'` ) %}

doubleQuoteStr -> "\"" ([\sa-zA-Z0-9\'\`\~\!\@\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:] | "\\\""):* "\"" {% ([_, e]) => ( `"${e.join("")}"` ) %}

number    ->  float1 | float2 | float3 | integer

float1    ->  "-":? [0-9]:+ "." [0-9]:+  {% ([minus, integ, dot, metisa]) => {
      return parseFloat(minus? '-': '' + integ.join("") + dot + metisa.join(""));
  } %}
float2    ->  "-":? "." [0-9]:+  {% ([minus, dot, metisa]) => {
      return parseFloat(minus? '-': '' + dot + metisa.join(""));
  } %}

float3    ->  "-":? [0-9]:+ "."  {% ([minus, integ, dot]) => {
      return parseFloat(minus? '-': '' + integ.join("") + dot);
  } %}

integer   ->  "-":? [0-9]:+  {% ([minus, integ]) => {
      return parseInt(minus? '-': '' + integ.join(""));
  } %}

