import {
  anyCharExcept,
  char,
  regex,
  sequenceOf,
  str,
  choice,
  coroutine,
  either,
  endOfInput,
  letter,
  letters,
  possibly,
  sepBy,
  many,
  anythingExcept,
  digit,
  digits,
  optionalWhitespace,
  between,
  anyOfString,
  recursiveParser,
  tapParser,
  whitespace,
  many1,
} from 'arcsecond';


const list = coroutine(function* () {
  yield char('[');
  yield optionalWhitespace;
  const words = yield sepBySpace(word);
  yield optionalWhitespace;
  yield char(']');
  return words;
});

const comicSwears = choice([
  char('~'),
  char('!'),
  char('@'),
  // char('#'),
  char('$'),
  char('%'),
  char('^'),
  char('&'),
  char('*'),
  char('_'),
  char('-'),
  char('+'),
  char('='),
  char('.'),
  char('?'),
  char('/'),
  char('|'),
  char('.'),
]);

const basicStr = sequenceOf([
  optionalWhitespace,
  many1(choice([
    letter, 
    digit, 
    comicSwears
  ])).map(r => r.join(''))
]).map(r => r[1]);

const word =  choice([
  //tapParser(log(2)),
  list,
  basicStr,
])

// util 
const sepBySpace = valueParser => coroutine(function* () {
  const results = [];
  while (true) {
    const value = yield either(valueParser);
    if (value.isError) break;
    results.push(value);
    const sep = yield either(whitespace);
    if (sep.isError) break;
  }
  return results.map(a => a.value);
});
const log = m1 => m2 => console.log(m1, m2);
const comment = sequenceOf([
    char('#'),
    // tapParser(log(1)),
    many(anyCharExcept(char('\n'))),
    tapParser(log(1)),
    // choice([char('\n'), endOfInput]),
    // tapParser(log(2)),
  ]).map(r => ([]));

export const pounce = coroutine(function* () {
  yield optionalWhitespace;
  //const program = yield sepBySpace(word);
  const program = yield many(choice([comment, sepBySpace(word)]));
  yield optionalWhitespace;
  return program[0];
});

// // console.log(JSON.stringify(pounce.run(' [  a] a2 [] [b* [-a  -123  ] ]   ')));