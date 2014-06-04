#!/usr/bin/env node

var fs = require('fs');
var Transform = require('stream').Transform;
var bytes = require('bytes');
var strftime = require('strftime');

//
// Input
//

var input = process.argv[2]
  ? fs.createReadStream(process.argv[2])
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
  var segs = [
    bytes(volume).toUpperCase(),
    strftime('%H:%M:%S', new Date((new Date) - start - 3600000)),
    '[' + bytes(throughput).toUpperCase() + '/s]'
  ];
  process.stderr.write('\r\033[2K ' + segs.join('  ') + ' ');
  throughput = 0;
}

input.on('close', clearInterval.bind(null, interval));

