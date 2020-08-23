## paste into https://omrelli.ug/nearley-playground/

pounce -> programList {% (pl) => {
    return {pounce : pl[0].filter(i => i !== null) };
 } %}
programList -> optS | optS word moreWords:* optS {% ([_, f, r]) => {
    if (f && f.length) {
        return [...f, ...r];
    } 
    return [f, ...r];
    } %}

optS -> " ":* {% () => null %}
reqS -> " ":+ {% () => null %}

word -> number | string | list {% ([word]) => {
    if(word && word.word) {
        return word;
    }
    return word;
} %}
moreWords -> reqS word optS {% ([_, terms]) => {
    if (terms && terms.length) {
        return terms[0];
    }
    if (terms && terms.list) {
        return terms;
    }
    return {moreWords: "unexpected", terms}
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

string -> plainStr | singleQuoteStr | doubleQuoteStr {% e => e[0] %}
plainStr -> [a-zA-Z]:+ {% e => ({string: e[0].join("") }) %}
singleQuoteStr -> "'" [a-zA-Z]:+ "'" {% ([_, e]) => ({string: `'${e.join("")}'` }) %}
doubleQuoteStr -> "\"" [a-zA-Z]:+ "\"" {% ([_, e]) => ({string: `"${e.join("")}"` }) %}

number -> "-":? [0-9]:+ ("." [0-9]:+):? {% (a) => {
	const sign = a[0] ? a[0] : "";
	const decimal = a[1].join("");
	const metisa = a[2]? "." + a[2][1] : "";
	return {number: sign + decimal + metisa };
} %}