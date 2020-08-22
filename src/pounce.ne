#@{%

#const moo = require('moo')

#let lexer = moo.compile({
#    space: {match: /\s+/, lineBreaks: true},
#    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
#    string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
#    '{': '{',
#    '}': '}',
#    '[': '[',
#    ']': ']',
#    ',': ',',
#    ':': ':',
#    true: 'true',
#    false: 'false',
#})

#%}

# @lexer lexer


## paste into https://omrelli.ug/nearley-playground/
pounce -> optS value:? optValue2 optS

optS -> " ":* {% () => null %}
reqS -> " " {% () => null %}

value -> number | word | list {% (item) => item[0] %}
optValue2 -> ( reqS optS value optS ):* {% (terms) => terms[0].map((e) => (e)) %}

list -> "[" pounce "]" {% ([a, item, b]) => ({list:[...item]}) %}

word -> "a"

number -> "5"