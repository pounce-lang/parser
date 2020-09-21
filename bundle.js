(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('arcsecond')) :
  typeof define === 'function' && define.amd ? define(['exports', 'arcsecond'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pounceParser = {}, global.arcsecond));
}(this, (function (exports, arcsecond) { 'use strict';

  const list = arcsecond.coroutine(function* () {
    yield arcsecond.char('[');
    yield arcsecond.optionalWhitespace;
    const words = yield sepBySpace(word);
    yield arcsecond.optionalWhitespace;
    yield arcsecond.char(']');
    return words;
  });

  const comicSwears = arcsecond.choice([
    arcsecond.char('~'),
    arcsecond.char('!'),
    arcsecond.char('@'),
    // char('#'),
    arcsecond.char('$'),
    arcsecond.char('%'),
    arcsecond.char('^'),
    arcsecond.char('&'),
    arcsecond.char('*'),
    arcsecond.char('_'),
    arcsecond.char('-'),
    arcsecond.char('+'),
    arcsecond.char('='),
    arcsecond.char('.'),
    arcsecond.char('?'),
    arcsecond.char('/'),
    arcsecond.char('|'),
    arcsecond.char('.'),
  ]);

  const basicStr = arcsecond.sequenceOf([
    arcsecond.optionalWhitespace,
    arcsecond.many1(arcsecond.choice([
      arcsecond.letter, 
      arcsecond.digit, 
      comicSwears
    ])).map(r => r.join(''))
  ]).map(r => r[1]);

  const word =  arcsecond.choice([
    //tapParser(log(2)),
    list,
    basicStr,
  ]);

  // util 
  const sepBySpace = valueParser => arcsecond.coroutine(function* () {
    const results = [];
    while (true) {
      const value = yield arcsecond.either(valueParser);
      if (value.isError) break;
      results.push(value);
      const sep = yield arcsecond.either(arcsecond.whitespace);
      if (sep.isError) break;
    }
    return results.map(a => a.value);
  });
  const log = m1 => m2 => console.log(m1, m2);
  const comment = arcsecond.sequenceOf([
      arcsecond.char('#'),
      // tapParser(log(1)),
      arcsecond.many(arcsecond.anyCharExcept(arcsecond.char('\n'))),
      arcsecond.tapParser(log(1)),
      // choice([char('\n'), endOfInput]),
      // tapParser(log(2)),
    ]).map(r => ([]));

  const pounce = arcsecond.coroutine(function* () {
    yield arcsecond.optionalWhitespace;
    //const program = yield sepBySpace(word);
    const program = yield arcsecond.many(arcsecond.choice([comment, sepBySpace(word)]));
    yield arcsecond.optionalWhitespace;
    return program[0];
  });

  // // console.log(JSON.stringify(pounce.run(' [  a] a2 [] [b* [-a  -123  ] ]   ')));

  exports.pounce = pounce;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
