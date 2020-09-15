# parser
a Pounce parser
I love the nearley parser generator, but like all the parser generators that I have tried, it did not provide a mantainable solution for my parsing needs. I would like to try again and regain control in the future, I miss the rr diagrams that nearley makes, amoung other nicaties.
```
npx nearleyc src/pounce.ne -o build/pounce.js
npx nearley-test -i " a 5 [ 5 a ]" build/pounce.js
```

After reading a corroborating blog post that confirmed that my 'troubles' with parser generators was not an
isolated event attributable to an incompitant developer incapable of handling the regular level of chaos that a typical peg + parser generator requires, at least it wasn't me. Right? Well the conclusion of this afferming article was that you were better off writing a hand coded parser, great off I go. With not too much of a plan other than we know it would need to be recursive, at least the part that handles parsing nested lists. Well that feeling creeped back in, ohhh nooo, so I looked around and grabbed on of the best tools I have ever used to get a project back on track, back to organized, back to structural separation of concerns, a all around
rock solid, case hardened, methodology, state machines.
```
rollup src/pounce.js --file bundle.js --format umd --name "pounceParser"
```
But then I read an interesting comment on another parsing realted blog and it simpley asked. "Have you looked into parser combinators?" Well no I hsdent and so zoom off again I quickly found Arcsecond, so cool. I just have to try it. May the best parser suit of tools win and if they all fail, it's me and too many choices, not all parsers are junk. Between nearley, pegjs, canopy, hand-coded & xstate/fsm and arcsecond, two or three will be successful, well canopy is the pounce v1 parser, so that is already as successful as this whole endever, humpf. Hey, I keep building it for fun and it does not matter who does or does not see the fun that is being had. 