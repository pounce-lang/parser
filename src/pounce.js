import { createMachine, interpret, assign } from '@xstate/fsm';

const parserMachine = createMachine({
    id: 'parser',
    initial: 'outerList',
    context: {
        s: `  a   bcd ef `, i: 0,
        currentWord: '',
        ast: []
    },
    states: {
        outerList: {
          on: {
                START_WORD: 'word',
                START_STRING: 'string',
                START_LIST: { target: 'pushList', actions: () => console.log('transition to push list') },
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
                    ast: (ctx) => [...ctx.ast, ctx.currentWord],
                    currentWord: () => ('') 
                }),
            on: { 'WORD_REC': 'outerList' }
        },
        pushList: {
            on: { END_LIST: 'outerList' }
        },
        popList: {
            on: {
                END_WORD: 'outerList'
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
                WS: 'outerList'
            }
        },
        eof: {
        }
    }
});

const toggleService = interpret(parserMachine).start();

const send = (letter, e) => {
    console.log(`letter ${letter} send event ${e}`);
    toggleService.send(e);
};

toggleService.subscribe((state) => {
    console.log(JSON.stringify(state.context), state.changed);
    const st = state.value;
    const { s, i } = state.context;
    if (state.changed !== false) {
        if (st !== 'eof' && s.length <= i) {
            send('EOF', 'EOF');
        }
        else if (st === 'outerList' && s[i] === "[") {
            send(s[i], 'START_LIST');
        }
        else if (st === 'outerList' && s[i] === " ") {
            send(s[i], 'WS');
        }
        else if (st === 'outerList' && s[i] !== " ") {
            send(s[i], 'START_WORD');
        }
        else if ((st === 'word' || st === 'wordEtc') && s[i] === " ") {
            send(s[i], 'END_WORD');
        }
        else if ((st === 'word' || st === 'wordEtc') && s[i] !== ' ') {
            send(s[i], 'MORE_WORD');
        }
        else if (st === 'ws') {
            send(s[i], 'END_WS');
        }
        else if (st === 'endWord') {
            send(s[i], 'WORD_REC');
        }
    }
});

