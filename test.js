var test = require('tape');
var spawn = require('child_process').spawn;
var tmpdir = require('os').tmpdir;
var fs = require('fs');

test('bin stdin pass through', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.on('data', t.error.bind(t));
  ps.stdout.on('data', function(chunk){
    t.equal(chunk.toString(), 'hey');
    t.end();
  });
  ps.stdin.end('hey');
});

test('bin stdarg read', function(t){
  var tmp = tmpdir() + '/pv' + Math.random();
  fs.writeFileSync(tmp, 'hey');

  var ps = spawn(__dirname + '/bin/pv.js', [tmp]);
  ps.on('error', t.error.bind(t));
  ps.stderr.on('data', t.error.bind(t));
  ps.stdout.on('data', function(chunk){
    t.equal(chunk.toString(), 'hey');
    t.end();
  });
});

test('bin volume', function(t){
  var ps = spawn(__dirname + '/bin/pv.js');
  ps.on('error', t.error.bind(t));
  ps.stderr.on('data', function(chunk){
    ps.stdin.end();
    t.equal(chunk.toString(), ' 3B\r');
    t.end();
  });
  ps.stdin.write('hey');
});

