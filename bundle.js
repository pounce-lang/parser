(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('daggy'), require('arcsecond'), require('path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'daggy', 'arcsecond', 'path'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pounceParser = {}, global.daggy, global.arcsecond));
}(this, (function (exports, daggy, arcsecond) { 'use strict';

  const JSONType = daggy.taggedSum('JSON', {
    JBoolean: ['x'],
    JNumber: ['x'],
    JNull: [],
    JArray: ['x'],
    JString: ['x'],
    JObject: ['x'],
    JKeyValuePair: ['x', 'y'],
  });

  const times = str => n => Array.from({ length: n }, () => str).join('');
  const tabs = times('  ');

  JSONType.prototype.toString = function(l = 0) {
    return this.cata({
      JBoolean: x => `${tabs(l)}Boolean(${x.toString()})`,
      JNumber: x => `${tabs(l)}Number(${x.toString()})`,
      JNull: () => `${tabs(l)}Null`,
      JArray: x =>
        `${tabs(l)}Array(\n${x.map(e => e.toString(l + 1)).join(',\n')}\n${tabs(l)})`,
      JString: x => `${tabs(l)}String(${x.toString()})`,
      JObject: x =>
        `${tabs(l)}Object(\n${x.map(e => e.toString(l + 1)).join(',\n')}\n${tabs(l)})`,
      JKeyValuePair: (x, y) =>
        `${tabs(l)}KeyValuePair(\n${x.toString(l + 1)},\n${y.toString(l + 1)}\n${tabs(l)})`,
    });
  };

  const JBoolean = JSONType.JBoolean;
  const JNumber = JSONType.JNumber;
  const JArray = JSONType.JArray;
  const JString = JSONType.JString;
  const JObject = JSONType.JObject;
  const JKeyValuePair = JSONType.JKeyValuePair;

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

  const basicStr = arcsecond.many1(arcsecond.choice([arcsecond.letter, arcsecond.digit, comicSwears])).map(r => r.join(''));


  const word =  arcsecond.choice([
    basicStr,
    list
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

  const comment = arcsecond.sequenceOf([
      arcsecond.char('#'), 
      arcsecond.many(arcsecond.anyCharExcept(arcsecond.char('\n'))), 
      arcsecond.choice([arcsecond.char('\n'), arcsecond.endOfInput])
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
