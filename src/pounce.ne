## paste into https://omrelli.ug/nearley-playground/

pounce -> programList {% (pl) => {
    return {pounce : pl[0].filter(i => i !== null) };
 } %}
programList -> optS | optS word anotherWord:* optS {% ([_, f, r]) => {
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
    } %}

optS -> " ":* {% () => null %}
reqS -> " ":+ {% () => null %}

word -> number | string | list {% ([word]) => {
    if (typeof word === 'string') {
        return word;
    }
    if (word.list) {
        return [[word.list]];
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

list -> "[" programList "]" {% ([_, items]) => {
    const list = items.filter(i => i !== null);
    if (list && list.length) {
        if (list[0].length) {
            const head = list.shift();
            return {list: [head[0], ...list]};
        }
        return {list};
    }
    return {list}
} %}

string -> plainStr 
    | singleQuoteStr 
    | doubleQuoteStr 

plainStr -> [a-zA-Z\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:]:+ {% ([e]) => ( `${e.join("")}` ) %}

singleQuoteStr -> "'"  ([\sa-zA-Z0-9\"\`\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:] | "\\'"):* "'" {% ([_, e]) => ( `'${e.join("")}'` ) %}

doubleQuoteStr -> "\"" ([\sa-zA-Z0-9\'\`\~\!\@\#\$\%\^\&\*\-\_\=\+\/\\\?\.\,\<\>\;\:] | "\\\""):* "\"" {% ([_, e]) => ( `"${e.join("")}"` ) %}

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

