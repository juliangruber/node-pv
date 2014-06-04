#!/usr/bin/env node

var fs = require('fs');
var Transform = require('stream').Transform;

var input = process.argv[2]
  ? fs.createReadStream(process.argv[2])
  : process.stdin;

var tr = Transform();
tr._transform = function(chunk, _, done){

  done(null, chunk);
};

input.pipe(tr).pipe(process.stdout);

