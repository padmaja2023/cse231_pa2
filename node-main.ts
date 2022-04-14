import {compile, run} from './compiler';

var importObject = {
  imports: {
    print: (arg : any) => {
      console.log("Logging from WASM: ", arg);
      const elt = document.createElement("pre");
      document.getElementById("output").appendChild(elt);
      elt.innerText = arg;
      return arg;
    },
    abs: Math.abs,
    pow: Math.pow,
    max: Math.max,
    min: Math.min
  },
};

// command to run:
// node node-main.js 987
const input = process.argv[2];
var values = compile(input)
const result = values[1];
console.log(result);
run(result,importObject).then((value) => {
  console.log(value);
});

