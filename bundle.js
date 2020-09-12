(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@xstate/fsm')) :
    typeof define === 'function' && define.amd ? define(['@xstate/fsm'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fsm));
}(this, (function (fsm) { 'use strict';

    const parserMachine = fsm.createMachine({
        id: 'parser',
        initial: 'outerList',
        context: {
            s: `a   bcd ef `, i: 0
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
                entry: fsm.assign({ i: (ctx) => ctx.s[ctx.i] === ' ' ? ctx.i : ctx.i + 1 }),
                on: {
                  MORE_WORD: 'wordEtc',
                    END_WORD: 'outerList',
                    EOF: 'eof'
                }
            },
            wordEtc: {
                entry: fsm.assign({ i: (ctx) => ctx.s[ctx.i] === ' ' ? ctx.i : ctx.i + 1 }),
                on: {
                  MORE_WORD: 'word',
                    END_WORD: 'outerList',
                    EOF: 'eof'
                }
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
                entry: fsm.assign({ i: (ctx) => ctx.s[ctx.i] === ' ' ? ctx.i+1 : ctx.i }),
                on: {
                    END_WS: 'outerList',
                    WS: 'outerList'
                }
            },
            eof: {
            }
        }
    });

    const toggleService = fsm.interpret(parserMachine).start();

    const send = (letter, e) => {
        console.log(`letter ${letter} send event ${e}`);
        toggleService.send(e);
    };

    toggleService.subscribe((state) => {
        // console.log(JSON.stringify(state));
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
        }
    });


    // send(s[i], 'START_WORD');
    // // => logs 'active'

    // send(s[i], 'END_WORD');

    // send(s[i], 'START_WORD');
    // // => logs 'active'

    // send(s[i], 'END_WORD');


    // send(s[i], 'START_LIST');
    // // => logs 'inactive'
    // send(s[i], 'IMMIDIATE');


    // toggleService.stop();

})));
