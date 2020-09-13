import { createMachine, interpret, assign } from '@xstate/fsm';

const parserMachine = createMachine({
    id: 'parser',
    initial: 'outerList',
    context: {
        s: `  [a]  [ bcd ][t]  ]ef[] `, i: 0,
        currentWord: '',
        subListLevel: 0,
        ast: [[]],
        success: null
    },
    states: {
        outerList: {
          on: {
                START_WORD: 'word',
                START_STRING: 'string',
                START_LIST: 'pushList',
                END_LIST: 'popList',
                WS: 'ws',
                EOF: 'eof'
            }
        },
        word: {
            entry: assign({ 
                currentWord: (ctx) => ctx.currentWord+ctx.s[ctx.i],
                i: (ctx) => ctx.s[ctx.i] === ' ' ? ctx.i : ctx.i + 1 
            }),
            on: {
                MORE_WORD: 'wordEtc',
                END_WORD: 'endWord',
                EOF: 'eof'
            }
        },
        wordEtc: {
            entry: assign({
                currentWord: (ctx) => ctx.currentWord+ctx.s[ctx.i], 
                i: (ctx) => (ctx.i + 1)
            }),
            on: {
                MORE_WORD: { target: 'wordEtc', actions: () => assign({ i: (ctx) => (ctx.i + 1) })},
                END_WORD:'endWord',
                EOF: 'eof'
            }
        },
        endWord: {
            entry: assign({ 
                ast: (c) => {
                    let level = c.subListLevel;
                    console.log("endWord level", level);
                    let astLevel = c.ast[level]
                    astLevel = [...astLevel, c.currentWord];
                    return [...c.ast.slice(0, -1), astLevel];
                },
                currentWord: () => ('') 
                }),
            on: { 'WORD_REC': 'outerList' }
        },
        pushList: {
            entry: assign({
                subListLevel: (c) => c.subListLevel+1,
                ast: (c) => {
                    let level = c.subListLevel+1;
                    console.log("pushList level", level);
                    return [...c.ast, []];
                },
                i: (c) => c.i+1
            }),
            on: { BACK: 'outerList' }
        },
        popList: {
            entry: assign({
                subListLevel: (c) => c.subListLevel-1,
                i: (c) => c.i+1,
                ast: (c) => {
                    let last = c.ast.pop();
                    let len = c.ast.length;
                    if (len < 1) {
                        return [last, "ERROR: missmatched ']' square bracket"];
                    }
                    c.ast[len-1].push(last);
                    // console.log("pushList level", level);
                    return c.ast;
                },

            }),
            on: {
                BACK: 'outerList'
            }
        },
        string: {
            on: {
                END_STRING: 'outerList'
            }
        },
        ws: {
            entry: assign({ i: (ctx) => ctx.s[ctx.i] === ' ' ? ctx.i+1 : ctx.i }),
            on: {
                END_WS: 'outerList',
                WS: 'outerList',
                EOF: 'eof'
            }
        },
        eof: {
            entry: assign({
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

const toggleService = interpret(parserMachine).start();

const send = (state, letter, e) => {
    console.log(`from ${state} letter ${letter} send event ${e}`);
    toggleService.send(e);
};

toggleService.subscribe((state) => {
    console.log(JSON.stringify(state.context), state.changed);
    const st = state.value;
    const { s, i } = state.context;
    if (state.changed !== false) {
        if (st !== 'eof' && s.length <= i) {
            send(state.value, 'EOF', 'EOF');
            toggleService.stop();
        }
        else if (st === 'outerList' && s[i] === "[") {
            send(state.value, s[i], 'START_LIST');
        }
        else if (st === 'outerList' && s[i] === "]") {
            send(state.value, s[i], 'END_LIST');
        }
        else if (st === 'outerList' && s[i] === " ") {
            send(state.value, s[i], 'WS');
        }
        else if (st === 'outerList' && s[i] !== " ") {
            send(state.value, s[i], 'START_WORD');
        }
        else if ((st === 'word' || st === 'wordEtc') && 
            (s[i] === " " || s[i] === '[' || s[i] === ']')) {
            send(state.value, s[i], 'END_WORD');
        }
        else if ((st === 'word' || st === 'wordEtc') && s[i] !== ' ') {
            send(state.value, s[i], 'MORE_WORD');
        }
        else if (st === 'ws') {
            send(state.value, s[i], 'END_WS');
        }
        else if (st === 'endWord') {
            send(state.value, s[i], 'WORD_REC');
        }
        else if (st === 'pushList') {
            send(state.value, s[i], 'BACK');
        }
        else if (st === 'popList') {
            send(state.value, s[i], 'BACK');
        }
    }
});

