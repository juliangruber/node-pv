#!/usr/bin/env node

var fs = require('fs');
var minimist = require('minimist');
var PV = require('..');

//
// Arguments
//

var argv = minimist(process.argv.slice(2), {
  alias: {
    'name': 'N',
    'size': 's'
  }
});

//
// Input
//

var input = argv._[0]
  ? fs.createReadStream(argv._[0])
  : process.stdin;

//
// Size
//

var size;

if (argv.size) {
  size = argv.size;
} else if (argv._[0]) {
  size = fs.statSync(argv._[0]).size;
}

//
// Go!
//

var pv = PV({
  name: argv.name,
  size: size
});

input.pipe(pv).pipe(process.stdout);

pv.on('info', function(str){
  process.stderr.write(str);
});

