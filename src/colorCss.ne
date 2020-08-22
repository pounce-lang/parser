# Match a CSS color
# http://www.w3.org/TR/css3-color/#colorunits
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives

pounce -> _ value (space value):* _

value -> _ decimal _
#    | _ int _
#    | _ record _
    | _ list _
    | _ word _

word -> [a-zA-Z]:+

space -> " "

list ->"[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (space value):* _ "]" {% extractArray %}


@{%

function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

%}