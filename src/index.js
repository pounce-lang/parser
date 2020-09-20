
import {
  JBoolean,
  JNumber,
  JNull,
  JArray,
  JString,
  JObject,
  JKeyValuePair,
} from './json.type';

import {
  anyCharExcept,
  char,
  sequenceOf,
  str,
  choice,
  coroutine,
  either,
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
  whitespace,
  many1,
} from 'arcsecond';
import { join } from 'path';

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
  char('#'),
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
]);

const basicStr = many1(choice([letter, digit, comicSwears])).map(r => r.join(''));


const word =  choice([
  basicStr,
  list
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



const pounce = sepBySpace(word)

console.log(JSON.stringify(pounce.run('[  a] a2 [] [b* [-a  -123  ] ]')));