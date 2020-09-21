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
  
  const log = m1 => m2 => console.log(m1, JSON.stringify(m2.result));
  const space = many1(choice([
    whitespace, 
    // char('\n')
  ]));
  const optionalSpace = possibly(space);
  const comment = sequenceOf([
      char('#'),
      // tapParser(log(1)),
      /////many(anyCharExcept(char('\n'))),
      letters
      // tapParser(log(2)),
      // choice([char('\n'), endOfInput]),
      // tapParser(log(3)),
    ]).map(r => ([]));
  
  const list = coroutine(function* () {
    yield char('[');
    yield optionalSpace;
    const words = yield sepBySpace(choice([comment, word]));
    yield optionalSpace;
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
  
  const basicStr = many1(choice([
      letter, 
      digit, 
      comicSwears
    ])).map(r => r.join(''));
  
  const word =  choice([
    tapParser(log(8)),
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
      const sep = yield either(space);
      if (sep.isError) break;
    }
    return results.map(a => a.value);
  });
  
  export const pounce = coroutine(function* () {
    yield optionalSpace;
    //const program = yield sepBySpace(word);
    const program = yield sepBySpace(choice([comment, word]));
  //  yield optionalSpace;
    return program;
  });
  
  // // console.log(JSON.stringify(pounce.run(' [  a] a2 [] [b* [-a  -123  ] ]   ')));