# parser
A Pounce parser


Although, I love the (nearley parser generator)[https://nearley.js.org/] and the (Canopy parser)[http://canopy.jcoglan.com/], just like all the generators I have tried, they did not provide a mantainable solution for my parsing needs. I will try them again and hopfully regain all their bennefits in the future. After all, I miss the rr diagrams that nearley makes, amoung other nicaties and canopy gives you four languages to run in. I am leaning these build commands as a reminder to com back to it someday sooner than never.
```
npx nearleyc src/pounce.ne -o build/pounceNe.js
npx nearley-test -i " a 5 [ 5 a ]" build/pounceNe.js
```

After reading a corroborating blog post that confirmed that my 'troubles' with parser generators was not an
isolated event attributable to an incompitant developer, incapable of handling the usual level of chaos that a typical peg + parser generator requires, I concluded that, at least it wasn't me. Right? Hmmm, maybe, but the conclusion of this afferming article was that you're better off writing a hand coded parser, great! Off I go. So with not too much of a plan, other than we know there'll be some recursive-decent for the part that handles parsing nested lists. Going great guns until that feeling creeped back in, ohhh nooo chaos, so I looked around and grabbed one of the best tools I have ever used. It gets a project back on track every time, back to organized, back to a structure with separation of concerns, An all around rock solid, case hardened, methodology, ummm talking state machines. Yea xstate is a nice one and it is working well. 

```
rollup src/pounceHCPwSt.js --file bundle.js --format umd --name "pounceParser"
```

Then I read an interesting comment on another parsing realted blog and it simply asked, "Have you looked into parser combinators?"  Well no I haden't and so, zoom off I go again. I quickly found Arcsecond, so cool. At this point, I will have to try it. Timing to be determined.
```
rollup src/pounceArcsec.js --file bundle.js --format umd --name "pounceParser"
```
A whole other way of looking at parsing could be to transform your input into a more palettable string that would be much easier to parse. If comments the thing that really warps the grammar of the parser into a twist, then a pre-processing removal of all comments (or maybe a transformation to a more easily parsed form) could really save you from having to give up on using your favorite PG or PC toolkit.



May the best parser suit of tools win and if they all fail, it's me and too many choices, not all parsers are junk. Between nearley, pegjs, canopy, hand-coded & xstate/fsm and arcsecond, two or three will be successful, well canopy is the pounce v1 parser, so that is already as successful as this whole endever, humpf. Hey, I keep building it for fun and it does not matter who does or does not see the fun that is being had. 
