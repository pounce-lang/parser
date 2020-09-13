(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@xstate/fsm')) :
   typeof define === 'function' && define.amd ? define(['@xstate/fsm'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fsm));
}(this, (function (fsm) { 'use strict';

   const parserMachine = fsm.createMachine({
       id: 'parser',
       initial: 'outerList',
       context: {
           s: `  [a]  [ bcd "please"
[t ""]  ]ef["high"] 
   'five'`,
           i: 0,
           currentWord: '',
           currentString: '',
           subListLevel: 0,
           ast: [[]],
           success: null,
           line: 1,
           colOffset: 0
       },
       states: {
           outerList: {
               on: {
                   START_WORD: 'word',
                   START_STRING: 'string',
                   START_LIST: 'pushList',
                   END_LIST: 'popList',
                   SPACE: 'space',
                   EOF: 'eof'
               }
           },
           word: {
               entry: fsm.assign({
                   currentWord: ctx => ctx.currentWord + ctx.s[ctx.i],
                   i: ctx => ctx.i + 1
               }),
               on: {
                   MORE_WORD: 'wordEtc',
                   END_WORD: 'wordEnd',
                   EOF: 'eof'
               }
           },
           wordEtc: {
               entry: fsm.assign({
                   currentWord: ctx => ctx.currentWord + ctx.s[ctx.i],
                   i: ctx => ctx.i + 1
               }),
               on: {
                   MORE_WORD: 'wordEtc',
                   END_WORD: 'wordEnd',
                   EOF: 'eof'
               }
           },
           wordEnd: {
               entry: fsm.assign({
                   ast: (c) => {
                       let level = c.subListLevel;
                       console.log("wordEnd level", level);
                       let astLevel = c.ast[level];
                       astLevel = [...astLevel, c.currentWord];
                       return [...c.ast.slice(0, -1), astLevel];
                   },
                   currentWord: () => ('')
               }),
               on: { REC_WORD: 'outerList' }
           },
           pushList: {
               entry: fsm.assign({
                   subListLevel: (c) => c.subListLevel + 1,
                   ast: (c) => {
                       let level = c.subListLevel + 1;
                       console.log("pushList level", level);
                       return [...c.ast, []];
                   },
                   i: ctx => ctx.i + 1
               }),
               on: { BACK: 'outerList' }
           },
           popList: {
               entry: fsm.assign({
                   subListLevel: (c) => c.subListLevel - 1,
                   i: ctx => ctx.i + 1,
                   ast: (c) => {
                       let last = c.ast.pop();
                       let len = c.ast.length;
                       if (len < 1) {
                           return [c.i, last, `ERROR: missmatched ']' square bracket on line ${c.line}, column ${(c.i - c.colOffset)}`, last];
                       }
                       c.ast[len - 1].push(last);
                       return c.ast;
                   },
               }),
               on: {
                   BACK: 'outerList',
                   EOF: 'eof'
               }
           },
           string: {
               entry: fsm.assign({
                   currentString: ctx => ctx.currentString + ctx.s[ctx.i],
                   i: ctx => ctx.i + 1
               }),
               on: {
                   MORE_STRING: 'stringEtc',
                   END_STRING: 'stringEnd',
                   EOF: 'eof'
               }
           },
           stringEtc: {
               entry: fsm.assign({
                   currentString: ctx => ctx.currentString + ctx.s[ctx.i],
                   i: ctx => ctx.i + 1
               }),
               on: {
                   MORE_STRING: 'stringEtc',
                   END_STRING: 'stringEnd',
                   EOF: 'eof'
               }
           },
           stringEnd: {
               entry: fsm.assign({
                   ast: (c) => {
                       let level = c.subListLevel;
                       console.log("stringEnd level", level);
                       let astLevel = c.ast[level];
                       astLevel = [...astLevel, c.currentString+c.currentString[0]];
                       return [...c.ast.slice(0, -1), astLevel];
                   },
                   currentString: () => (''),
                   i: ctx => ctx.i + 1
               }),
               on: { REC_STRING: 'outerList' }
           },
           space: {
               entry: fsm.assign({
                   i: ctx => ctx.i + 1,
                   line: c => c.s[c.i] === '\n' ? c.line + 1 : c.line,
                   colOffset: c => c.s[c.i] === '\n' ? c.i : c.colOffset
               }),
               on: {
                   END_SPACE: 'outerList',
                   SPACE: 'outerList',
                   EOF: 'eof'
               }
           },
           eof: {
               entry: fsm.assign({
                   success: (c) => (c.ast.length === 1 && c.subListLevel === 0),
                   ast: (c) => {
                       console.log("fin");
                       if (c.ast.length === 1 && c.subListLevel === 0) {
                           return c.ast[0];
                       }
                       return c.ast;
                   }
               })
           }
       }
   });

   const toggleService = fsm.interpret(parserMachine).start();

   const send = (state, letter, e) => {
       console.log(`from ${state} letter ${letter} send event ${e}`);
       toggleService.send(e);
   };

   toggleService.subscribe((state) => {
       console.log(JSON.stringify(state.context), state.changed);
       const st = state.value;
       const { s, i, ast, currentString } = state.context;
       if (state.changed !== false) {
           if (st !== 'eof' && s.length <= i || typeof ast[0] === 'number') {
               send(state.value, 'EOF', 'EOF');
               toggleService.stop();
           }
           // list
           else if (st === 'outerList' && s[i] === "[") {
               send(state.value, s[i], 'START_LIST');
           }
           else if (st === 'outerList' && s[i] === "]") {
               send(state.value, s[i], 'END_LIST');
           }
           // space
           else if (st === 'outerList' && (s[i] === " " || s[i] === "\n" || s[i] === "\t")) {
               send(state.value, s[i], 'SPACE');
           }
           // word
           else if (st === 'outerList' && s[i] !== " " && s[i] !== "\t" && s[i] !== "\n" && s[i] !== "'" && s[i] !== "\"" && s[i] !== "`") {
               send(state.value, s[i], 'START_WORD');
           }
           else if ((st === 'word' || st === 'wordEtc') &&
               (s[i] === " " || s[i] === "\n" || s[i] === "\t" || s[i] === '[' || s[i] === ']')) {
               send(state.value, s[i], 'END_WORD');
           }
           else if ((st === 'word' || st === 'wordEtc') && s[i] !== ' ') {
               send(state.value, s[i], 'MORE_WORD');
           }
           // quoted string
           else if (st === 'outerList' && (s[i] === "'" || s[i] === "\"" || s[i] === "`")) {
               send(state.value, s[i], 'START_STRING');
           }
           else if ((st === 'string' || st === 'stringEtc') &&
               s[i] === currentString[0] && !(st === 'stringEtc' && s[i-1] === '\\'))  {
               send(state.value, s[i], 'END_STRING');
           }
           else if ((st === 'string' || st === 'stringEtc') && 
               !(s[i] === currentString[0] && !(st === 'stringEtc' && s[i-1] === '\\'))) {
               send(state.value, s[i], 'MORE_STRING');
           }
           // transient states
           else if (st === 'space') {
               send(state.value, s[i], 'END_SPACE');
           }
           else if (st === 'wordEnd') {
               send(state.value, s[i], 'REC_WORD');
           }
           else if (st === 'stringEnd') {
               send(state.value, s[i], 'REC_STRING');
           }
           else if (st === 'pushList') {
               send(state.value, s[i], 'BACK');
           }
           else if (st === 'popList') {
               send(state.value, s[i], 'BACK');
           }
       }
   });

})));
