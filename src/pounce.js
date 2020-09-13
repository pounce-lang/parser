import { createMachine, interpret, assign } from '@xstate/fsm';

export const parse = pounceSrc => {

    const parserMachine = createMachine({
        id: 'parser',
        initial: 'outerList',
        context: {
            s: pounceSrc,
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
                    EOF: 'eof',
                    COMMENT: 'comment'
                }
            },
            word: {
                entry: assign({
                    currentWord: ctx => ctx.currentWord + ctx.s[ctx.i],
                    i: ctx => ctx.i + 1
                }),
                on: {
                    MORE_WORD: 'wordEtc',
                    END_WORD: 'wordEnd',
                    EOF: 'wordEnd'
                }
            },
            wordEtc: {
                entry: assign({
                    currentWord: ctx => ctx.currentWord + ctx.s[ctx.i],
                    i: ctx => ctx.i + 1
                }),
                on: {
                    MORE_WORD: 'wordEtc',
                    END_WORD: 'wordEnd',
                    EOF: 'wordEnd'
                }
            },
            wordEnd: {
                entry: assign({
                    ast: (c) => {
                        let level = c.subListLevel;
                        let astLevel = c.ast[level]
                        astLevel = [...astLevel, c.currentWord];
                        return [...c.ast.slice(0, -1), astLevel];
                    },
                    currentWord: () => ('')
                }),
                on: { REC_WORD: 'outerList', EOF: 'eof' }
            },
            pushList: {
                entry: assign({
                    subListLevel: (c) => c.subListLevel + 1,
                    ast: (c) => {
                        let level = c.subListLevel + 1;
                        return [...c.ast, []];
                    },
                    i: ctx => ctx.i + 1
                }),
                on: { BACK: 'outerList' }
            },
            popList: {
                entry: assign({
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
                entry: assign({
                    currentString: ctx => ctx.currentString + ctx.s[ctx.i],
                    i: ctx => ctx.i + 1
                }),
                on: {
                    MORE_STRING: 'stringEtc',
                    END_STRING: 'stringEnd',
                    EOF: 'stringEnd'
                }
            },
            stringEtc: {
                entry: assign({
                    currentString: ctx => ctx.currentString + ctx.s[ctx.i],
                    i: ctx => ctx.i + 1
                }),
                on: {
                    MORE_STRING: 'stringEtc',
                    END_STRING: 'stringEnd',
                    EOF: 'stringEnd'
                }
            },
            stringEnd: {
                entry: assign({
                    ast: (c) => {
                        let level = c.subListLevel;
                        let astLevel = c.ast[level]
                        astLevel = [...astLevel, c.currentString + c.currentString[0]];
                        return [...c.ast.slice(0, -1), astLevel];
                    },
                    currentString: () => (''),
                    i: ctx => ctx.i + 1
                }),
                on: { REC_STRING: 'outerList', EOF: 'eof' }
            },
            space: {
                entry: assign({
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
            comment: {
                entry: assign({
                    i: ctx => ctx.i + 1,
                    line: c => c.s[c.i] === '\n' ? c.line + 1 : c.line,
                    colOffset: c => c.s[c.i] === '\n' ? c.i : c.colOffset
                }),
                on: {
                    END_COMMENT: 'outerList',
                    COMMENT: 'comment',
                    EOF: 'eof'
                }
            },
            eof: {
                entry: assign({
                    success: (c) => (c.ast.length === 1 && c.subListLevel === 0),
                    ast: (c) => {
                        // console.log("fin");
                        if (c.ast.length === 1 && c.subListLevel === 0) {
                            return c.ast[0];
                        }
                        return c.ast;
                    }
                })
            }
        }
    });

    const parserService = interpret(parserMachine).start();

    const send = (state, letter, e) => {
        // console.log(`from ${state} letter ${letter} send event ${e}`);
        parserService.send(e);
    };
    let lastAst = [];
    let lastSuccess = null;

    parserService.subscribe((state) => {
        // console.log(JSON.stringify(state.context), state.changed, state.value);
        const st = state.value;
        const { s, i, ast, currentString, success } = state.context;
        lastAst = ast;
        lastSuccess = success;

        if (state.changed !== false) {
            if ((st !== 'eof' && s.length <= i) || typeof ast[0] === 'number') {
                send(state.value, 'EOF', 'EOF');
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
            // comment
            else if (st === 'outerList' && s[i] === "#") {
                send(state.value, s[i], 'COMMENT');
            }
            else if (st === 'comment' && s[i] !== "\n") {
                send(state.value, s[i], 'COMMENT');
            }
            else if (st === 'comment' && s[i] === "\n") {
                send(state.value, s[i], 'END_COMMENT');
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
                s[i] === currentString[0] && !(st === 'stringEtc' && s[i - 1] === '\\')) {
                send(state.value, s[i], 'END_STRING');
            }
            else if ((st === 'string' || st === 'stringEtc') &&
                !(s[i] === currentString[0] && !(st === 'stringEtc' && s[i - 1] === '\\'))) {
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
        else {
            return {ast, success};
        }
    });
    return {ast: lastAst, success: lastSuccess};
};
