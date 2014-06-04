#!/usr/bin/env node

var fs = require('fs');
var Transform = require('stream').Transform;
var bytes = require('bytes');
var strftime = require('strftime');
var minimist = require('minimist');

//
// Arguments
//

var argv = minimist(process.argv.slice(2), {
  alias: {
    'name': 'N'
  }
});

//
// Input
//

var input = argv._[0]
  ? fs.createReadStream(argv._[0])
  : process.stdin;

//
// State
//

var volume = 0;
var throughput = 0;
var start = new Date;

//
// Transform
//

var tr = Transform();
var first = true;
tr._transform = function(buf, _, done){
  volume += buf.length;
  throughput += buf.length;

  if (first) {
    progress();
    first = false;
  }

  done(null, buf);
};

//
// Connect
//

input.pipe(tr).pipe(process.stdout);

//
// Progress
//

var interval = setInterval(progress, 1000);

function progress(){
  var segs = [];
  if (argv.N) segs.push(argv.N + ':');
  segs.push(bytes(volume).toUpperCase());
  segs.push(strftime('%H:%M:%S', new Date((new Date) - start - 3600000)));
  segs.push('[' + bytes(throughput).toUpperCase() + '/s]');

  process.stderr.write('\r' + segs.join('  '));
  throughput = 0;
}

input.on('close', clearInterval.bind(null, interval));

