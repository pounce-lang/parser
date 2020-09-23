const {
    choice,
    digits,
    sepBy,
    between,
    char,
    optionalWhitespace,
    whitespace,
    recursiveParser,
    sequenceOf,
} = require('arcsecond');

const surroundedBy = parser => between(parser)(parser);
const betweenSquareBrackets = between(char('['))(char(']'));
const spaceSeparated = sepBy(whitespace)

const number = digits;

// Wrapping the parser up into a recursiveParser, which takes a function that returns a parser
const listElement = recursiveParser(() => sequenceOf([
    optionalWhitespace.map(r => null),
    choice([
        list,
        number, 
        optionalWhitespace.map(r => null)
    ])
]));

const list = betweenSquareBrackets(spaceSeparated(listElement));

const result = list.run(`[1 
    2 []  [ 3 [4 5 ]] 6]`);

if (!result.isError) {
    console.log(JSON.stringify(result.result));
}