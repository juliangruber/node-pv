#!/usr/bin/env node

var fs = require('fs');
var Transform = require('stream').Transform;
var bytes = require('bytes');

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

//
// Transform
//

var tr = Transform();
tr._transform = function(buf, _, done){
  volume += buf.length;
  done(null, buf);
};

//
// Connect
//

input.pipe(tr).pipe(process.stdout);

//
// Progress
//

var interval = setInterval(function(){
  var out = ' '
    + bytes(volume).toUpperCase()
    + '\r';
  process.stderr.write(out);
}, 1000);

input.on('close', clearInterval.bind(null, interval));

