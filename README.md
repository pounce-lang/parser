# parser
a Pounce parser

```
npx nearleyc src/pounce.ne -o build/pounce.js
npx nearley-test -i " a 5 [ 5 a ]" build/pounce.js
```


```
rollup src/pounce.js --file bundle.js --format umd --name "pounceParser"
```